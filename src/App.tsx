import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { NoteList } from "./components/NoteList";
import { NoteForm } from "./components/NoteForm";
import { Toaster } from "sonner";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">My Notes</h1>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Content />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Notes</h2>
            <p className="text-gray-600">Sign in to create and manage your notes</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {loggedInUser?.email?.split('@')[0] || 'friend'}!
            </h2>
            <p className="text-gray-600 mt-1">Manage your notes and ideas</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showCreateForm ? "Cancel" : "New Note"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            <NoteForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        )}

        <NoteList />
      </Authenticated>
    </div>
  );
}
