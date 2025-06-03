
import React, { useState } from "react";
import SimpleNoteEditor from "@/components/notes/SimpleNoteEditor";
import { useNotes } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NotesPage = () => {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleSave = async (noteData) => {
    if (editingNote) {
      await updateNote(editingNote.id, noteData);
    } else {
      await createNote(noteData);
    }
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleDelete = async (noteId) => {
    await deleteNote(noteId);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
        <div className="container mx-auto p-6">
          <SimpleNoteEditor 
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Notes</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage your notes</p>
          </div>
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-dincharya-primary hover:bg-dincharya-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No notes yet</p>
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-dincharya-primary hover:bg-dincharya-primary/90 text-white"
            >
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="bg-white dark:bg-dincharya-text/90 border-dincharya-border dark:border-dincharya-muted">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-dincharya-text dark:text-white truncate">
                      {note.title}
                    </CardTitle>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(note)}
                        className="h-8 w-8 p-0 hover:bg-dincharya-muted/20"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(note.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                    {note.content}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
