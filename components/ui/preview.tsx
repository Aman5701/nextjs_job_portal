"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { lowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";
// import html from "highlight.js/lib/languages/xml";
// import css from "highlight.js/lib/languages/css";
import { useEffect, useState } from "react";

// ✅ Register languages ONCE here
// lowlight.registerLanguage("html", html);
// lowlight.registerLanguage("javascript", javascript);
// lowlight.registerLanguage("css", css);

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    editable: false,
    content: value,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "No content available",
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-4 rounded-md font-mono text-sm",
        },
      }),
    ],
  });

  if (!mounted || !editor) {
    return (
      <div className="animate-pulse bg-gray-100 h-40 rounded-md p-4">
        <p className="text-sm text-gray-400">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-md p-4 prose prose-sm max-w-none">
      <EditorContent editor={editor} />
      <style>{`
        .ProseMirror img {
          cursor: zoom-in;
          max-width: 100%;
          border-radius: 0.375rem;
        }
        .ProseMirror a {
          text-decoration: underline;
          color: #2563eb;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 0.75rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }
        .ProseMirror code {
          background-color: #f9fafb;
          color: #1f2937;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};
