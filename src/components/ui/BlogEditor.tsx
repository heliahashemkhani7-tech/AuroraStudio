import { useEffect } from "react";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";

type BlogEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const StyledHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as 1 | 2 | 3;

    const headingStyles: Record<1 | 2 | 3, string> = {
      1: "font-size: 2em; font-weight: 700; margin-top: 0.67em; margin-bottom: 0.67em;",
      2: "font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em;",
      3: "font-size: 1.17em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em;",
    };

    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, {
        style: headingStyles[level] ?? "",
      }),
      0,
    ];
  },
});

export default function BlogEditor({
  value,
  onChange,
  placeholder = "Write your article here...",
  disabled = false,
}: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      StyledHeading.configure({
        levels: [1, 2, 3],
      }),
    ],
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

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="min-h-[300px] animate-pulse rounded-lg border border-border bg-muted/30" />
    );
  }

  const buttonClass = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border hover:bg-muted"
    }`;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <button
          type="button"
          disabled={disabled}
          aria-label="Bold"
          title="Bold"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Italic"
          title="Italic"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Heading"
          title="Heading"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Heading
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Bullet List"
          title="Bullet List"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Numbered List"
          title="Numbered List"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered List
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Blockquote"
          title="Blockquote"
          className={buttonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Blockquote
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Clear Formatting"
          title="Clear Formatting"
          className={buttonClass(false)}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          Clear Formatting
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="[&_.tiptap]:min-h-[300px] [&_.tiptap]:outline-none"
      />
    </div>
  );
}