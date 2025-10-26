import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Note } from "../types/Note";
import { NoteForm } from "./NoteForm";
import { toast } from "sonner";

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteNote = useMutation(api.notes.remove);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteNote({ id: note._id });
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Note</h3>
        <NoteForm
          note={note}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {note.title}
        </h3>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {note.content && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap line-clamp-3">
          {note.content}
        </p>
      )}
      
      <div className="text-xs text-gray-400">
        Created {formatDate(note._creationTime)}
      </div>
    </div>
  );
}
