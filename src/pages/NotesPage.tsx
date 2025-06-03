
import React from "react";
import SimpleNoteEditor from "@/components/notes/SimpleNoteEditor";

const NotesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your notes</p>
        </div>
        
        <SimpleNoteEditor />
      </div>
    </div>
  );
};

export default NotesPage;
