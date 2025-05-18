
import React, { useState } from 'react';
import { Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (title: string, content: string, tags: string[]) => void;
  loading?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  content = '', 
  onChange, 
  placeholder,
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  onSave,
  loading = false
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [editorContent, setEditorContent] = useState(initialContent || content);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
    ],
    content: initialContent || content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      if (onChange) onChange(html);
    },
  });

  const handleTagAdd = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(title, editorContent, tags);
    }
  };

  if (!editor && content) {
    return null;
  }

  if (onSave) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full mb-2"
            required
          />
        </div>
        
        <div className="border rounded-md shadow-sm bg-white dark:bg-gray-800 min-h-[200px]">
          {editor && <EditorContent editor={editor} />}
        </div>
        
        <div>
          <div className="flex space-x-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (press Enter)"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleTagAdd}
              variant="outline"
            >
              Add Tag
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map(tag => (
                <span key={tag} className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center">
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => handleTagRemove(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="border rounded-md shadow-sm bg-white dark:bg-gray-800">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
