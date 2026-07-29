import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-200 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-maroon-800" />
          <span className="text-2xl font-bold text-maroon-800">BoiBondhu</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
