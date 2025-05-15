
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FileText, Plus, Search, Edit, Trash2 } from "lucide-react";
import { NoteEditor } from "@/components/notes/NoteEditor";
import ReactMarkdown from 'react-markdown';
import { Database } from "@/integrations/supabase/types";

type NotesRow = Database['public']['Tables']['notes']['Row'];

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: string[];
}

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);
  
  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Failed to load notes",
        description: "There was an error loading your notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateNote = async (title: string, content: string, tags: string[]) => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          user_id: user.id,
          tags
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setNotes([data as Note, ...notes]);
      setCreateDialogOpen(false);
      
      toast({
        title: "Note created",
        description: "Your note has been saved successfully"
      });
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Failed to create note",
        description: "There was an error saving your note",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleUpdateNote = async (title: string, content: string, tags: string[]) => {
    if (!user || !selectedNote) return;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('notes')
        .update({
          title,
          content,
          tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedNote.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setNotes(notes.map(note => 
        note.id === data.id ? data as Note : note
      ));
      
      setEditDialogOpen(false);
      setSelectedNote(null);
      
      toast({
        title: "Note updated",
        description: "Your changes have been saved"
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Failed to update note",
        description: "There was an error saving your changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
      setViewDialogOpen(false);
      setSelectedNote(null);
      
      toast({
        title: "Note deleted",
        description: "Your note has been permanently removed"
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Failed to delete note",
        description: "There was an error deleting your note",
        variant: "destructive"
      });
    }
  };
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dincharya-text dark:text-white">My Notes</h1>
        
        <Button 
          onClick={() => setCreateDialogOpen(true)} 
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes by title, content or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-[220px] animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Card 
              key={note.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-[220px] flex flex-col"
              onClick={() => {
                setSelectedNote(note);
                setViewDialogOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  {format(new Date(note.updated_at), "MMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <div className="line-clamp-4 text-sm text-gray-600">
                  {note.content}
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-3 flex flex-wrap gap-1">
                {note.tags && note.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                    {tag}
                  </span>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {searchQuery 
              ? "No notes match your search criteria. Try a different search term."
              : "Create your first note to start organizing your thoughts and ideas."}
          </p>
          {!searchQuery && (
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
        </div>
      )}
      
      {/* Create Note Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to your collection
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto pr-2">
            <NoteEditor 
              onSave={handleCreateNote}
              loading={saving}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Note Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          {selectedNote && (
            <>
              <DialogHeader className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <DialogTitle className="text-2xl pr-8">{selectedNote.title}</DialogTitle>
                  <div className="flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewDialogOpen(false);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(selectedNote.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DialogDescription>
                  {`Last updated ${format(new Date(selectedNote.updated_at), "MMMM d, yyyy 'at' h:mm a")}`}
                </DialogDescription>
                
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedNote.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </DialogHeader>
              
              <div className="overflow-y-auto pr-2 max-h-[500px] mt-2 prose prose-sm">
                <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Note Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note
            </DialogDescription>
          </DialogHeader>
          
          {selectedNote && (
            <div className="overflow-y-auto pr-2">
              <NoteEditor 
                initialTitle={selectedNote.title}
                initialContent={selectedNote.content}
                initialTags={selectedNote.tags || []}
                onSave={handleUpdateNote}
                loading={saving}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesPage;
