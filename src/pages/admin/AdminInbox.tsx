import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  RefreshCw,
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
  const { i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(
    null
  );

  const text = {
    title: isPersian ? "صندوق پیام‌ها" : "Inbox",
    description: isPersian
      ? "پیام‌های دریافتی از فرم تماس سایت"
      : "Messages received through your website contact form",
    all: isPersian ? "همه پیام‌ها" : "All messages",
    unread: isPersian ? "خوانده‌نشده" : "Unread",
    read: isPersian ? "خوانده‌شده" : "Read",
    search: isPersian ? "جست‌وجو در پیام‌ها..." : "Search messages...",
    loading: isPersian ? "در حال دریافت پیام‌ها..." : "Loading messages...",
    loadError: isPersian
      ? "دریافت پیام‌ها ناموفق بود."
      : "Failed to load messages.",
    empty: isPersian ? "هنوز پیامی دریافت نشده است." : "No messages yet.",
    noResults: isPersian
      ? "پیامی با این مشخصات پیدا نشد."
      : "No matching messages found.",
    sender: isPersian ? "فرستنده" : "Sender",
    email: isPersian ? "ایمیل" : "Email",
    projectType: isPersian ? "نوع پروژه" : "Project type",
    message: isPersian ? "متن پیام" : "Message",
    back: isPersian ? "بازگشت به پیام‌ها" : "Back to messages",
    markRead: isPersian ? "علامت‌گذاری به‌عنوان خوانده‌شده" : "Mark as read",
    markUnread: isPersian
      ? "علامت‌گذاری به‌عنوان خوانده‌نشده"
      : "Mark as unread",
    delete: isPersian ? "حذف پیام" : "Delete message",
    deleteTitle: isPersian ? "حذف پیام" : "Delete message",
    deleteDescription: isPersian
      ? "آیا از حذف این پیام مطمئن هستی؟ این عملیات قابل بازگشت نیست."
      : "Are you sure you want to delete this message? This action cannot be undone.",
    deleted: isPersian ? "پیام حذف شد." : "Message deleted.",
    updated: isPersian ? "وضعیت پیام تغییر کرد." : "Message status updated.",
    updateError: isPersian
      ? "تغییر وضعیت پیام ناموفق بود."
      : "Failed to update message status.",
    deleteError: isPersian
      ? "حذف پیام ناموفق بود."
      : "Failed to delete message.",
    retry: isPersian ? "تلاش مجدد" : "Try again",
    refresh: isPersian ? "به‌روزرسانی" : "Refresh",
    newMessage: isPersian ? "جدید" : "New",
    total: isPersian ? "کل پیام‌ها" : "Total",
    unreadCount: isPersian ? "خوانده‌نشده" : "Unread",
  };

  async function loadMessages(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      setError(null);

      const data = await getAdminContactMessages();
      setMessages(data);
    } catch (err) {
      console.error("Error loading contact messages:", err);
      setError(text.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialMessages() {
      try {
        const data = await getAdminContactMessages();

        if (!cancelled) {
          setMessages(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading contact messages:", err);

        if (!cancelled) {
          setError(
            isPersian
              ? "دریافت پیام‌ها ناموفق بود."
              : "Failed to load messages."
          );
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
  }, [isPersian]);

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
        ].some((value) => value?.toLowerCase().includes(normalizedSearch));

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
      toast.error(text.updateError);
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
          item.id === message.id ? { ...item, is_read: nextIsRead } : item
        )
      );

      toast.success(text.updated);
    } catch (err) {
      console.error("Failed to update message status:", err);
      toast.error(text.updateError);
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

      toast.success(text.deleted);
    } catch (err) {
      console.error("Failed to delete contact message:", err);
      toast.error(text.deleteError);
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  return (
    <section dir={isPersian ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{text.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMessages(true)}
          disabled={loading || refreshing}
          className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-dashboard-bg disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {text.refresh}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Inbox size={17} />
            {text.total}
          </div>
          <p className="mt-2 text-2xl font-semibold">{messages.length}</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={17} />
            {text.unreadCount}
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
                placeholder={text.search}
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
                  {text[item]}
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
                {text.retry}
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
                  {messages.length === 0 ? text.empty : text.noResults}
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
                                {text.newMessage}
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
                            message.is_read ? text.markUnread : text.markRead
                          }
                          aria-label={
                            message.is_read ? text.markUnread : text.markRead
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
                          title={text.delete}
                          aria-label={text.delete}
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
              <ArrowLeft size={17} className={isPersian ? "rotate-180" : ""} />
              {text.back}
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
                {selectedMessage.is_read ? text.markUnread : text.markRead}
              </button>

              <button
                type="button"
                onClick={() => setPendingDelete(selectedMessage)}
                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                title={text.delete}
                aria-label={text.delete}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <User size={17} />
                {text.sender}
              </div>
              <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
              <a
                href={`mailto:${selectedMessage.email}`}
                className="mt-1 inline-block break-all text-sm text-primary hover:underline"
              >
                {selectedMessage.email}
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {text.projectType}:{" "}
                <span className="font-medium text-text">
                  {selectedMessage.project_type || "—"}
                </span>
              </span>
              <span>{formatDate(selectedMessage.created_at)}</span>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="mb-3 flex items-center gap-2 font-medium">
                <MessageSquare size={18} />
                {text.message}
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
        loading={pendingDelete !== null && deletingId === pendingDelete.id}
        title={text.deleteTitle}
        description={text.deleteDescription}
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
