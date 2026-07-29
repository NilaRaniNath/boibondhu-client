"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Trash2, ExternalLink, BookOpen, Edit3, X } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/lib/types";

const CATEGORIES = ["Academic", "Novel", "Comics", "QuestionBank", "Bengali Classic", "Fantasy", "Non-Fiction", "Self-Help", "Poetry", "Classic Fiction", "Others"];

export default function ManageBooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/");
  }, [user, router]);

  async function fetchBooks() {
    try {
      const data = await api<{ books: Book[] }>("/api/books?limit=100");
      setBooks(data.books);
    } catch { setBooks([]); } finally { setLoading(false); }
  }

  useEffect(() => { fetchBooks(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Remove this book?")) return;
    try {
      await api(`/api/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book removed from catalog");
    } catch { toast.error("Failed to remove book"); }
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-maroon-800">Manage Books</h1>
        <Link href="/items/add" className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          + Add Book
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />)}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-cream-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-cream-200 bg-cream-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-cream-600">Book</th>
                  <th className="px-4 py-3 font-medium text-cream-600">Category</th>
                  <th className="px-4 py-3 font-medium text-cream-600">Price</th>
                  <th className="px-4 py-3 font-medium text-cream-600">Stock</th>
                  <th className="px-4 py-3 font-medium text-cream-600">Sold</th>
                  <th className="px-4 py-3 font-medium text-cream-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b border-cream-100 hover:bg-cream-50">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <img src={book.coverImage} alt="" className="h-10 w-8 rounded object-cover" />
                      <div>
                        <p className="font-medium text-maroon-800 line-clamp-1">{book.title}</p>
                        <p className="text-xs text-cream-500">{book.author}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cream-600">{book.category}</td>
                    <td className="px-4 py-3 font-medium text-green-600">&#2547;{book.price}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${book.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cream-600">{book.totalSold}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/books/${book._id}`} className="rounded-lg p-1.5 text-cream-500 hover:bg-cream-100 hover:text-maroon-800">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setEditingBook(book)} className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(book._id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingBook && <EditModal book={editingBook} onClose={() => setEditingBook(null)} onSaved={(updated) => { setBooks((prev) => prev.map((b) => b._id === updated._id ? updated : b)); setEditingBook(null); }} />}
    </div>
  );
}

function EditModal({ book, onClose, onSaved }: { book: Book; onClose: () => void; onSaved: (book: Book) => void }) {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    description: book.description,
    price: String(book.price),
    coverImage: book.coverImage,
    category: book.category,
    condition: book.condition,
    stock: String(book.stock),
    isbn: book.isbn || "",
    pages: String(book.pages),
    language: book.language,
    publishedYear: String(book.publishedYear),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await api<Book>(`/api/books/${book._id}`, {
        method: "PATCH",
        json: {
          title: form.title,
          author: form.author,
          description: form.description,
          price: Number(form.price),
          coverImage: form.coverImage,
          category: form.category,
          condition: form.condition,
          stock: Number(form.stock),
          isbn: form.isbn || undefined,
          pages: Number(form.pages),
          language: form.language,
          publishedYear: Number(form.publishedYear),
        },
      });
      toast.success("Book updated successfully");
      onSaved(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update book";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
          <h2 className="text-lg font-bold text-maroon-800">Edit Book</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-cream-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" value={form.title} onChange={(v) => update("title", v)} required />
            <Field label="Author" value={form.author} onChange={(v) => update("author", v)} required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Description</label>
            <textarea rows={3} required value={form.description} onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (BDT)" type="number" value={form.price} onChange={(v) => update("price", v)} required />
            <Field label="Stock" type="number" value={form.stock} onChange={(v) => update("stock", v)} required />
            <Field label="Pages" type="number" value={form.pages} onChange={(v) => update("pages", v)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-cream-600">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-cream-600">Condition</label>
              <select value={form.condition} onChange={(e) => update("condition", e.target.value)}
                className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none">
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <Field label="Published Year" type="number" value={form.publishedYear} onChange={(v) => update("publishedYear", v)} required />
          </div>

          <Field label="Cover Image URL" value={form.coverImage} onChange={(v) => update("coverImage", v)} required />

          {form.coverImage && (
            <img src={form.coverImage} alt="Preview" className="h-32 w-24 rounded-lg border border-cream-300 object-cover" />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ISBN (optional)" value={form.isbn} onChange={(v) => update("isbn", v)} />
            <Field label="Language" value={form.language} onChange={(v) => update("language", v)} required />
          </div>

          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-cream-300 px-4 py-2.5 text-sm font-medium text-cream-700 hover:bg-cream-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required = false }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-cream-600">{label}</label>
      <input type={type} required={required} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
    </div>
  );
}
