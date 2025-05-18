import React from 'react';
import { Editor } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
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

const EditorContent: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <div className={cn(
      "min-h-[150px] p-4 rounded-md outline-none focus:outline-none",
      "prose prose-sm dark:prose-invert",
    )}
      suppressContentEditableWarning={true}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
      onBlur={() => editor.setEditable(false)}
      onFocus={() => editor.setEditable(true)}
      onInput={(e) => {
        if (editor.isEditable) {
          editor.commands.setContent(e.currentTarget.innerHTML);
        }
      }}
    />
  );
};

export default NoteEditor;
