"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Menu, X, BookOpen, LogOut, Shield, Search, Package, Home,
} from "lucide-react";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const guestLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Browse Books", icon: BookOpen },
    { href: "/about", label: "About", icon: BookOpen },
    { href: "/login", label: "Sign In" },
  ];

  const userLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Browse Books", icon: BookOpen },
    { href: "/about", label: "About", icon: BookOpen },
    { href: "/my-orders", label: "My Orders", icon: Package },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: Shield },
    { href: "/explore", label: "Explore Books", icon: BookOpen },
    { href: "/items/add", label: "Add Book" },
    { href: "/items/manage", label: "Manage Books" },
  ];

  const links = user
    ? user.role === "admin"
      ? [{ href: "/", label: "Home", icon: Home }, ...adminLinks]
      : userLinks
    : guestLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-300 bg-maroon-800 shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-cream-200" />
          <span className="text-xl font-bold text-cream-100">BoiBondhu</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-cream-200 transition-colors hover:bg-maroon-700 hover:text-cream-50"
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/explore?sortBy=newest"
            className="rounded-lg p-2 text-cream-200 transition-colors hover:bg-maroon-700 hover:text-cream-50"
          >
            <Search className="h-5 w-5" />
          </Link>

          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-maroon-700" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-cream-300">{user.name}</span>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-cream-200 md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-maroon-700 bg-maroon-800 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-cream-200 transition-colors hover:bg-maroon-700"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-maroon-700 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-cream-300">{user.name}</span>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-green-600 py-2 text-center text-sm font-medium text-white">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
