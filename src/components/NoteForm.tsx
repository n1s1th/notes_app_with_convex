import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Note } from "../types/Note";
import { toast } from "sonner";

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NoteForm({ note, onSuccess, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (note) {
        await updateNote({
          id: note._id,
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note updated successfully");
      } else {
        await createNote({
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Note created successfully");
        setTitle("");
        setContent("");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(note ? "Failed to update note" : "Failed to create note");
      console.error("Error saving note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : note ? "Update Note" : "Create Note"}
        </button>
      </div>
    </form>
  );
}
