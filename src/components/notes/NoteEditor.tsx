
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string, tags: string[]) => Promise<void>;
  loading?: boolean;
}

export function NoteEditor({ initialTitle = "", initialContent = "", onSave, loading = false }: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive"
      });
      return;
    }
    
    await onSave(title, content, tags);
  };
  
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Text formatting functions
  const insertFormat = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = "";
    let cursorPosition = 0;
    
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        cursorPosition = start + 2;
        break;
      case "h1":
        formattedText = `# ${selectedText}`;
        cursorPosition = start + 2;
        break;
      case "h2":
        formattedText = `## ${selectedText}`;
        cursorPosition = start + 3;
        break;
      case "h3":
        formattedText = `### ${selectedText}`;
        cursorPosition = start + 4;
        break;
      case "ul":
        formattedText = `- ${selectedText}`;
        cursorPosition = start + 2;
        break;
      case "ol":
        formattedText = `1. ${selectedText}`;
        cursorPosition = start + 3;
        break;
      default:
        break;
    }
    
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after format markers if no text was selected
    setTimeout(() => {
      if (start === end) {
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
      } else {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
      }
      textarea.focus();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="note-title" className="text-base font-medium">Title</Label>
        <Input
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="mb-2"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="note-content" className="text-base font-medium">Content</Label>
          <div className="flex space-x-1 text-gray-600 border rounded-md">
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("underline")}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <div className="border-l h-8"></div>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("h1")}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("h2")}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("h3")}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <div className="border-l h-8"></div>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("ul")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={() => insertFormat("ol")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="note-content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... You can use Markdown formatting!"
          className="min-h-[300px] font-mono"
        />
      </div>
      
      <div>
        <Label htmlFor="note-tags" className="text-base font-medium">Tags</Label>
        <div className="flex gap-2 mb-2">
          {tags.map(tag => (
            <div key={tag} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">{tag}</span>
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="note-tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tags"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addTag}
            variant="outline"
            disabled={!newTag}
          >
            Add
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave} 
          disabled={loading || !title}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

import React from "react";
