import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type BlogEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function BlogEditor({
  value,
  onChange,
  placeholder = "محتوای مقاله را اینجا بنویس...",
  disabled = false,
}: BlogEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] w-full px-4 py-3 outline-none prose prose-sm max-w-none dark:prose-invert",
        dir: "auto",
        "aria-label": placeholder,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="min-h-[300px] animate-pulse rounded-lg border border-span bg-muted/30" />
    );
  }

  const buttonClass = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-span hover:bg-muted"
    }`;

  return (
    <div className="overflow-hidden rounded-lg border border-span">
      <div className="flex flex-wrap items-center gap-2 border-b border-span p-3">
        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          تیتر
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          فهرست نقطه‌ای
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          فهرست شماره‌ای
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          نقل‌قول
        </button>

        <button
          type="button"
          disabled={disabled}
          className={buttonClass(false)}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          پاک‌کردن قالب‌بندی
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="[&_.tiptap]:min-h-[300px] [&_.tiptap]:outline-none"
      />
    </div>
  );
}
