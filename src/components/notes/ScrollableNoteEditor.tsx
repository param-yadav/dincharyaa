
import React from 'react';
import NoteEditor from './NoteEditor';

interface ScrollableNoteEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (title: string, content: string, tags: string[]) => void;
  loading?: boolean;
}

const ScrollableNoteEditor: React.FC<ScrollableNoteEditorProps> = ({
  content,
  onChange,
  placeholder,
  initialTitle,
  initialContent,
  initialTags,
  onSave,
  loading
}) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <NoteEditor 
        content={content}
        onChange={onChange}
        placeholder={placeholder}
        initialTitle={initialTitle}
        initialContent={initialContent}
        initialTags={initialTags}
        onSave={onSave}
        loading={loading}
      />
    </div>
  );
};

export default ScrollableNoteEditor;
