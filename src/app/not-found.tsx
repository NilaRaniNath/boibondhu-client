import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-200 px-4 text-center animate-fade-in-up">
      <BookOpen className="h-16 w-16 text-maroon-800 opacity-30 animate-float" />
      <h1 className="mt-6 text-6xl font-bold text-maroon-800">404</h1>
      <p className="mt-3 text-lg text-cream-700">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Back to Home
        </Link>
        <Link
          href="/explore"
          className="rounded-xl border border-cream-300 bg-white px-6 py-3 text-sm font-medium text-cream-700 hover:bg-cream-50"
        >
          Browse Books
        </Link>
      </div>
    </div>
  );
}
