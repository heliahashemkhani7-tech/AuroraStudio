
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BlogLoadingSkeleton from "@/components/skeleton/BlogLoadingSkeleton";
import {
  deleteContactMessage,
  getAdminContactMessages,
  markContactMessageAsRead,
  type ContactMessage,
} from "@/features/api";

type InboxFilter = "all" | "unread" | "read";

export default function AdminInbox() {
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<ContactMessage | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialMessages() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminContactMessages();

        if (!cancelled) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Error loading contact messages:", err);

        if (!cancelled) {
          setError(t("admin.inbox.loadError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialMessages();

    return () => {
      cancelled = true;
    };
  }, [isPersian, t]);

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminContactMessages();
      setMessages(data);
    } catch (err) {
      console.error("Error loading contact messages:", err);
      setError(t("admin.inbox.loadError"));
    } finally {
      setLoading(false);
    }
  }

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.is_read).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !message.is_read) ||
        (filter === "read" && message.is_read);

      const matchesSearch =
        !normalizedSearch ||
        [
          message.name,
          message.email,
          message.project_type,
          message.message,
        ].some((value) =>
          value?.toLowerCase().includes(normalizedSearch)
        );

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, search]);

  const selectedMessage =
    messages.find((message) => message.id === selectedId) ?? null;

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return new Intl.DateTimeFormat(isPersian ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }

  async function openMessage(message: ContactMessage) {
    setSelectedId(message.id);

    if (message.is_read) return;

    try {
      setUpdatingId(message.id);

      await markContactMessageAsRead(message.id, true);

      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err);
      toast.error(t("admin.inbox.updateError"));
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleReadStatus(message: ContactMessage) {
    const nextIsRead = !message.is_read;

    try {
      setUpdatingId(message.id);

      await markContactMessageAsRead(message.id, nextIsRead);

      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id
            ? { ...item, is_read: nextIsRead }
            : item
        )
      );

      toast.success(t("admin.inbox.updated"));
    } catch (err) {
      console.error("Failed to update message status:", err);
      toast.error(t("admin.inbox.updateError"));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(message: ContactMessage) {
    try {
      setDeletingId(message.id);

      await deleteContactMessage(message.id);

      setMessages((previous) =>
        previous.filter((item) => item.id !== message.id)
      );

      if (selectedId === message.id) {
        setSelectedId(null);
      }

      toast.success(t("admin.inbox.deleted"));
    } catch (err) {
      console.error("Failed to delete contact message:", err);
      toast.error(t("admin.inbox.deleteError"));
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  return (
    <section dir={isPersian ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("admin.inbox.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.inbox.description")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Inbox size={17} />
            {t("admin.inbox.total")}
          </div>
          <p className="mt-2 text-2xl font-semibold">{messages.length}</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={17} />
            {t("admin.inbox.unreadCount")}
          </div>
          <p className="mt-2 text-2xl font-semibold">{unreadCount}</p>
        </div>
      </div>

      {!selectedMessage && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
                  isPersian ? "right-3" : "left-3"
                }`}
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("admin.inbox.search")}
                className={`w-full rounded-lg border border-border bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-primary ${
                  isPersian ? "pr-10 pl-3" : "pl-10 pr-3"
                }`}
              />
            </div>

            <div className="flex gap-2">
              {(["all", "unread", "read"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    filter === item
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-dashboard-bg"
                  }`}
                >
                  {t(`admin.inbox.${item}`)}
                  {item === "unread" && unreadCount > 0
                    ? ` (${unreadCount})`
                    : ""}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <BlogLoadingSkeleton />
          ) : error ? (
            <div
              role="alert"
              className="space-y-3 rounded-xl border border-border p-6 text-center"
            >
              <p className="text-red-500">{error}</p>

              <button
                type="button"
                onClick={() => void loadMessages()}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-dashboard-bg"
              >
                {t("admin.inbox.retry")}
              </button>
            </div>
          ) : (
            <div
              className="overflow-hidden rounded-xl border border-border transition-shadow duration-300"
              style={{
                boxShadow: "0 8px 30px rgba(117, 67, 200, 0.12)",
              }}
            >
              {filteredMessages.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  <Inbox size={32} className="mx-auto mb-3 opacity-50" />
                  {messages.length === 0
                    ? t("admin.inbox.empty")
                    : t("admin.inbox.noResults")}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMessages.map((message) => (
                    <article
                      key={message.id}
                      className={`flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center ${
                        !message.is_read
                          ? "bg-primary/[0.04]"
                          : "hover:bg-dashboard-bg"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => void openMessage(message)}
                        className="flex min-w-0 flex-1 items-start gap-3 text-start"
                      >
                        <div className="mt-1 shrink-0 rounded-full border border-border p-2">
                          {message.is_read ? (
                            <MailOpen
                              size={18}
                              className="text-muted-foreground"
                            />
                          ) : (
                            <Mail size={18} className="text-primary" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`truncate ${
                                message.is_read
                                  ? "font-medium"
                                  : "font-semibold"
                              }`}
                            >
                              {message.name}
                            </span>

                            {!message.is_read && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                {t("admin.inbox.newMessage")}
                              </span>
                            )}
                          </div>

                          <p className="truncate text-sm text-muted-foreground">
                            {message.email}
                          </p>

                          <p className="line-clamp-2 text-sm">
                            {message.message}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{message.project_type || "—"}</span>
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                        </div>
                      </button>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void toggleReadStatus(message)}
                          disabled={updatingId === message.id}
                          className="rounded-md p-2 transition-colors hover:bg-border disabled:opacity-50"
                          title={
                            message.is_read
                              ? t("admin.inbox.markUnread")
                              : t("admin.inbox.markRead")
                          }
                          aria-label={
                            message.is_read
                              ? t("admin.inbox.markUnread")
                              : t("admin.inbox.markRead")
                          }
                        >
                          {message.is_read ? (
                            <Mail size={18} />
                          ) : (
                            <MailOpen size={18} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPendingDelete(message)}
                          disabled={deletingId === message.id}
                          className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          title={t("admin.inbox.delete")}
                          aria-label={t("admin.inbox.delete")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {selectedMessage && (
        <div
          className="overflow-hidden rounded-xl border border-border"
          style={{
            boxShadow: "0 8px 30px rgba(117, 67, 200, 0.12)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-dashboard-bg"
            >
              <ArrowLeft
                size={17}
                className={isPersian ? "rotate-180" : ""}
              />
              {t("admin.inbox.back")}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void toggleReadStatus(selectedMessage)}
                disabled={updatingId === selectedMessage.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-dashboard-bg disabled:opacity-50"
              >
                {selectedMessage.is_read ? (
                  <Mail size={16} />
                ) : (
                  <MailOpen size={16} />
                )}

                {selectedMessage.is_read
                  ? t("admin.inbox.markUnread")
                  : t("admin.inbox.markRead")}
              </button>

              <button
                type="button"
                onClick={() => setPendingDelete(selectedMessage)}
                disabled={deletingId === selectedMessage.id}
                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                title={t("admin.inbox.deleted")}
                aria-label={t("admin.inbox.deleted")}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <User size={17} />
                {t("admin.inbox.sender")}
              </div>

              <h2 className="text-xl font-semibold">
                {selectedMessage.name}
              </h2>

              <a
                href={`mailto:${selectedMessage.email}`}
                className="mt-1 inline-block break-all text-sm text-primary hover:underline"
              >
                {selectedMessage.email}
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {t("admin.inbox.projectType")}:{" "}
                <span className="font-medium text-text">
                  {selectedMessage.project_type || "—"}
                </span>
              </span>

              <span>{formatDate(selectedMessage.created_at)}</span>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="mb-3 flex items-center gap-2 font-medium">
                <MessageSquare size={18} />
                {t("admin.inbox.message")}
              </h3>

              <p className="whitespace-pre-wrap break-words text-sm leading-8">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        loading={
          pendingDelete !== null &&
          deletingId === pendingDelete.id
        }
        title={t("admin.inbox.deleteTitle")}
        description={t("admin.inbox.deleteDescription")}
        onCancel={() => {
          if (deletingId === null) {
            setPendingDelete(null);
          }
        }}
        onConfirm={() => {
          if (pendingDelete && deletingId === null) {
            void handleDelete(pendingDelete);
          }
        }}
      />
    </section>
  );
}
