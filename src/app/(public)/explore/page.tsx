"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import BookCard from "@/components/books/BookCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import type { Book } from "@/lib/types";

const CATEGORIES = ["", "Academic", "Novel", "Comics", "QuestionBank", "Bengali Classic", "Fantasy", "Non-Fiction", "Self-Help", "Poetry", "Classic Fiction", "Others"];

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-200 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-800 border-t-transparent" /></div>}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [showFilters, setShowFilters] = useState(false);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (condition) params.set("condition", condition);
    if (sortBy) params.set("sortBy", sortBy);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", String(page));
    params.set("limit", "8");
    return params.toString();
  }, [search, category, condition, sortBy, minPrice, maxPrice, page]);

  useEffect(() => {
    let cancelled = false;
    async function fetchBooks() {
      setLoading(true);
      setError(null);
      try {
        const qs = buildQuery();
        const data = await api<{ books: Book[]; pagination: { totalPages: number } }>(
          `/api/books?${qs}`
        );
        if (!cancelled) {
          setBooks(data.books);
          setTotalPages(data.pagination.totalPages);
        }
      } catch {
        if (!cancelled) {
          setBooks([]);
          setError("Failed to load books. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBooks();
    return () => { cancelled = true; };
  }, [buildQuery]);

  useEffect(() => {
    const qs = buildQuery();
    router.replace(`/explore?${qs}`, { scroll: false });
  }, [buildQuery, router]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  const hasActiveFilters = category || condition || minPrice || maxPrice;

  return (
    <div className="bg-cream-200 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-maroon-800">Explore Books</h1>
            <p className="text-sm text-cream-600">Discover your next favorite read</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-6 flex flex-col gap-3 animate-fade-in-up">
          <div className="flex gap-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full rounded-xl border border-cream-300 bg-white py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
                />
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-cream-300 bg-white text-cream-700 hover:bg-cream-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                  {[category, condition, minPrice, maxPrice].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="rounded-xl border border-cream-300 bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.filter(Boolean).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => { setCondition(e.target.value); setPage(1); }}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Any Condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Min Price (&#2547;)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Max Price (&#2547;)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => { setCategory(""); setCondition(""); setMinPrice(""); setMaxPrice(""); setPage(1); }}
                  className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-cream-600">Sort by:</span>
            {["newest", "price_asc", "price_desc"].map((s) => (
              <button
                key={s}
                onClick={() => { setSortBy(s); setPage(1); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortBy === s
                    ? "bg-maroon-800 text-cream-100"
                    : "bg-white text-cream-600 hover:bg-cream-100 border border-cream-300"
                }`}
              >
                {s === "newest" ? "Newest" : s === "price_asc" ? "Price Low" : "Price High"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : books.map((book, i) => (
                <div key={book._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
        </div>

        {!loading && books.length === 0 && !error && (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-maroon-800">No books found</p>
            <p className="mt-1 text-sm text-cream-600">Try adjusting your filters or search terms</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-lg font-semibold text-red-600">Something went wrong</p>
            <p className="mt-1 text-sm text-cream-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-maroon-800 px-5 py-2 text-sm font-medium text-cream-100 hover:bg-maroon-700 transition-colors">Try Again</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm font-medium text-cream-700 hover:bg-cream-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="px-2 text-cream-500">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium ${
                      page === p
                        ? "bg-maroon-800 text-cream-100"
                        : "border border-cream-300 bg-white text-cream-700 hover:bg-cream-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm font-medium text-cream-700 hover:bg-cream-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
