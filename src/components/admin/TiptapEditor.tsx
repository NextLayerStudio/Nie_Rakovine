"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useRef } from "react";
import type { Editor } from "@tiptap/react";

async function uploadImageFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await fetch("/api/upload/image", { method: "POST", body: fd });
    if (!res.ok) return null;
    const json = (await res.json()) as { url?: string };
    return json.url ?? null;
  } catch {
    return null;
  }
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded text-sm transition ${
        active
          ? "bg-brand-purple text-white"
          : "text-brand-purple/60 hover:bg-brand-purple/8 hover:text-brand-purple"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
    e.target.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-purple/10 px-2 py-1.5">
      {/* Text styles */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Tučné (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Kurzíva (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-brand-purple/15" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Nadpis H2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Nadpis H3"
      >
        H3
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-brand-purple/15" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bodkový zoznam"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <circle cx="2" cy="4" r="1.5" />
          <rect x="5" y="3" width="10" height="2" rx="1" />
          <circle cx="2" cy="8" r="1.5" />
          <rect x="5" y="7" width="10" height="2" rx="1" />
          <circle cx="2" cy="12" r="1.5" />
          <rect x="5" y="11" width="10" height="2" rx="1" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Číslovaný zoznam"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <text x="0" y="5" fontSize="5" fontFamily="sans-serif">1.</text>
          <rect x="5" y="3" width="10" height="2" rx="1" />
          <text x="0" y="9" fontSize="5" fontFamily="sans-serif">2.</text>
          <rect x="5" y="7" width="10" height="2" rx="1" />
          <text x="0" y="13" fontSize="5" fontFamily="sans-serif">3.</text>
          <rect x="5" y="11" width="10" height="2" rx="1" />
        </svg>
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-brand-purple/15" />

      {/* Blockquote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Citát"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M3 4h2v4H3V4zm0 5h2v3H3V9zm5-5h2v4H8V4zm0 5h2v3H8V9z" />
        </svg>
      </ToolbarButton>

      {/* Horizontal rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Oddeľovacia čiara"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <rect x="1" y="7" width="14" height="2" rx="1" />
        </svg>
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-brand-purple/15" />

      {/* Image upload */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
      />
      <ToolbarButton
        onClick={() => fileRef.current?.click()}
        title="Vložiť obrázok"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="2" width="14" height="12" rx="2" />
          <circle cx="5.5" cy="6" r="1.5" />
          <path d="M1 11l4-4 3 3 2-2 5 5" />
        </svg>
      </ToolbarButton>
    </div>
  );
}

export function TiptapEditor({
  name = "body",
  defaultValue = "",
  placeholder = "Napíšte obsah článku…",
  minHeight = 320,
}: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: number;
}) {
  // Hidden input — imperatively updated on every editor change so formData gets the current HTML
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    content: defaultValue || "",
    onUpdate({ editor }) {
      if (hiddenRef.current) {
        hiddenRef.current.value = editor.getHTML();
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        // Upload async, then insert
        uploadImageFile(file).then((url) => {
          if (url && view.state) {
            const { schema, tr } = view.state;
            const node = schema.nodes.image?.create({ src: url });
            if (node) {
              view.dispatch(tr.replaceSelectionWith(node));
            }
          }
        });
        return true;
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith("image/"));
        if (!imageFile) return false;
        event.preventDefault();
        uploadImageFile(imageFile).then((url) => {
          if (url && view.state) {
            const { schema, tr } = view.state;
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const node = schema.nodes.image?.create({ src: url });
            if (node && pos) {
              view.dispatch(tr.insert(pos.pos, node));
            }
          }
        });
        return true;
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-brand-purple/20 bg-white focus-within:border-brand-purple/40 focus-within:ring-1 focus-within:ring-brand-purple/20">
      <Toolbar editor={editor} />

      {/* Hidden input — DOM value kept in sync via onUpdate ref, not React state */}
      <input
        type="hidden"
        name={name}
        ref={hiddenRef}
        defaultValue={defaultValue}
      />

      <EditorContent
        editor={editor}
        className="tiptap-content px-4 py-3 text-sm text-brand-purple"
        style={{ minHeight }}
      />
    </div>
  );
}
