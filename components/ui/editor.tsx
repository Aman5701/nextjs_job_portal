"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect } from "react";
import { Toolbar } from "./toolbar";


interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  maxChars?: number;
}

export const Editor = ({ onChange, value, maxChars = 5000 }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your job description...",
      }),
      CharacterCount.configure({ limit: maxChars }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="bg-white border rounded-md p-2 space-y-2">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="min-h-[150px] prose prose-sm max-w-none" />
      {editor && (
        <p className="text-xs text-right text-gray-500">
          {editor.storage.characterCount.characters()}/{maxChars} characters
        </p>
      )}
    </div>
  );
};