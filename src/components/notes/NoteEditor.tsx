
import React from 'react';
import { Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ content, onChange, placeholder }) => {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Placeholder({
        placeholder: placeholder || 'Write something...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md shadow-sm bg-white dark:bg-gray-800">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
