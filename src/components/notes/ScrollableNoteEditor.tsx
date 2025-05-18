
import React from 'react';
import NoteEditor from './NoteEditor';

interface ScrollableNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ScrollableNoteEditor: React.FC<ScrollableNoteEditorProps> = ({
  content,
  onChange,
  placeholder
}) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <NoteEditor 
        content={content}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ScrollableNoteEditor;
