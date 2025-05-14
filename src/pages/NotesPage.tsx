
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome Note",
      content: "Welcome to your notes! Add your thoughts, ideas, and reminders here.",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleCreateNote = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }
    
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    
    toast({
      title: "Note created",
      description: "Your note has been created successfully",
    });
  };

  const handleEditNote = (note: Note) => {
    setEditing(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }
    
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title: editTitle, content: editContent, updatedAt: new Date() } 
        : note
    ));
    
    setEditing(null);
    
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Notes</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>
              Add a new note to your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your note here..."
                className="min-h-[100px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateNote} className="gap-2">
              <Plus className="h-4 w-4" /> Create Note
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                {editing === note.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-semibold"
                  />
                ) : (
                  <CardTitle>{note.title}</CardTitle>
                )}
                <CardDescription>
                  {formatDate(note.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editing === note.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="whitespace-pre-line">{note.content}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {editing === note.id ? (
                  <Button onClick={() => handleSaveEdit(note.id)} className="gap-2">
                    <Save className="h-4 w-4" /> Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEditNote(note)} className="gap-2">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteNote(note.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
