"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Tag,
  RotateCcw,
  Zap,
  Star,
  Users,
  BookMarked,
  Send,
  ChevronRight,
  GraduationCap,
  Heart,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";

/* ─── Hero ─── */
const SLIDER_BOOKS = [
  {
    title: "Pather Panchali",
    author: "Bibhutibhushan Bandyopadhyay",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&q=80",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
  },
];

function HeroSection() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = SLIDER_BOOKS.length;

  const goTo = useCallback((index: number) => {
    setCurrent((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next]);

  return (
    <section className="relative flex min-h-[65vh] items-center bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center">

          {/* ─── Left: Text ─── */}
          <div className="w-full max-w-2xl shrink-0 animate-fade-in-up">
            <span className="inline-block rounded-full bg-green-600/20 px-4 py-1.5 text-sm font-medium text-green-300">
              Your Trusted Bookstore
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-cream-100 sm:text-5xl lg:text-6xl">
              Every Book Tells a
              <span className="text-green-400"> Story.</span>
              <br />
              Find Yours.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-cream-400">
              Browse thousands of titles from Bengali classics to international
              bestsellers. Quality books at fair prices, delivered to your door.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cream-500" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pl-10 pr-4 text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
                />
              </div>
              <Link
                href={`/explore${query ? `?search=${encodeURIComponent(query)}` : ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Search Books
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-cream-400">
              <span>Popular:</span>
              {["Pather Panchali", "Atomic Habits", "The Hobbit"].map((t) => (
                <Link
                  key={t}
                  href={`/explore?search=${encodeURIComponent(t)}`}
                  className="rounded-full border border-cream-500/30 px-3 py-0.5 text-cream-300 transition-all duration-300 hover:border-cream-400 hover:text-cream-100 hover:bg-white/10"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* ─── Right: Slider ─── */}
          <div
            className="relative w-full max-w-sm shrink-0 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-maroon-700">
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                Featured Book
              </div>

              {/* Images */}
              <div className="aspect-[3/4] relative">
                {SLIDER_BOOKS.map((book, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === current ? 1 : 0 }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                      <p className="text-sm font-semibold text-white">{book.title}</p>
                      <p className="text-xs text-cream-300">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-maroon-800 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
              aria-label="Previous book"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-maroon-800 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
              aria-label="Next book"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {SLIDER_BOOKS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "h-2.5 w-6 bg-green-400"
                      : "h-2.5 w-2.5 bg-cream-500/50 hover:bg-cream-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Featured Books ─── */
function FeaturedBooks() {
  const featured = [
    {
      id: "1",
      title: "Pather Panchali",
      author: "Bibhutibhushan Bandyopadhyay",
      price: 350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      price: 490,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    },
    {
      id: "3",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 450,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
    },
    {
      id: "4",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 580,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    },
  ];

  return (
    <section className="bg-cream-200 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-maroon-800 sm:text-3xl">
              Featured Books
            </h2>
            <p className="mt-1 text-cream-700">
              Hand-picked bestsellers loved by our readers
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden text-sm font-medium text-green-600 hover:text-green-700 sm:inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-0.5"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
            <Link
              href={`/books/${book.id}`}
              className="group block overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="aspect-[3/4] overflow-hidden bg-cream-100">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-maroon-800 line-clamp-1">
                  {book.title}
                </h3>
                <p className="mt-0.5 text-sm text-cream-600">{book.author}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    &#2547;{book.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    {book.rating}
                  </span>
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Categories ─── */
function Categories() {
  const categories = [
    {
      name: "Academic",
      icon: GraduationCap,
      desc: "Textbooks, guides & research papers",
      href: "/explore?category=Academic",
      color: "bg-blue-50 text-blue-700",
    },
    {
      name: "Novel",
      icon: BookMarked,
      desc: "Fiction, romance & literary classics",
      href: "/explore?category=Novel",
      color: "bg-purple-50 text-purple-700",
    },
    {
      name: "Comics",
      icon: Heart,
      desc: "Graphic novels & comic collections",
      href: "/explore?category=Comics",
      color: "bg-pink-50 text-pink-700",
    },
    {
      name: "Question Bank",
      icon: HelpCircle,
      desc: "BCS, medical & competitive exams",
      href: "/explore?category=QuestionBank",
      color: "bg-orange-50 text-orange-700",
    },
    {
      name: "Others",
      icon: BookOpen,
      desc: "Self-help, poetry & non-fiction",
      href: "/explore?category=Others",
      color: "bg-green-50 text-green-700",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-2xl font-bold text-maroon-800 sm:text-3xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-center text-cream-600">
            Find exactly what you are looking for
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
            <Link
              href={cat.href}
              className="group flex flex-col items-center rounded-2xl border border-cream-200 p-6 text-center transition-shadow duration-300 hover:border-green-300 hover:shadow-lg"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-maroon-800">{cat.name}</h3>
              <p className="mt-1 text-xs text-cream-600">{cat.desc}</p>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search",
      desc: "Browse our catalog by title, author, category, or ISBN to find your next read.",
    },
    {
      icon: ShoppingCart,
      title: "Order",
      desc: "Add books to your cart, choose your preferred payment method, and place your order.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "We carefully pack and ship your books right to your doorstep within 2-5 days.",
    },
  ];

  return (
    <section className="bg-cream-200 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-2xl font-bold text-maroon-800 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-center text-cream-600">
            Getting your books is as easy as 1-2-3
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-maroon-800 text-cream-100 shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <step.icon className="h-9 w-9" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-maroon-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-cream-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why BoiBondhu ─── */
function WhyBoiBondhu() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Verified Quality",
      desc: "Every book is inspected for quality before shipping. No damaged or pirated copies.",
    },
    {
      icon: Tag,
      title: "Fair Prices",
      desc: "Competitive pricing with regular discounts. Get the best value for every taka spent.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "7-day hassle-free return policy. Not satisfied? Return it, no questions asked.",
    },
    {
      icon: Zap,
      title: "Fast Shipping",
      desc: "Dispatch within 24 hours. Dhaka delivery in 2-3 days, nationwide in 5 days.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-2xl font-bold text-maroon-800 sm:text-3xl">
            Why Choose BoiBondhu?
          </h2>
          <p className="mt-2 text-center text-cream-600">
            We go the extra mile for book lovers
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-cream-200 bg-cream-50 p-6 text-center transition-shadow duration-300 hover:border-green-300 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 text-white transition-transform duration-300 hover:scale-110">
                <r.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-maroon-800">{r.title}</h3>
              <p className="mt-2 text-sm text-cream-600">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
function LiveStats() {
  const stats = [
    { label: "Total Books", value: "10,000+", icon: BookOpen },
    { label: "Orders Delivered", value: "25,000+", icon: ShoppingCart },
    { label: "Happy Readers", value: "15,000+", icon: Users },
  ];

  return (
    <section className="bg-maroon-800 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="text-center"
            >
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon-700 text-green-400"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <s.icon className="h-8 w-8" />
              </motion.div>
              <p className="mt-4 text-3xl font-bold text-cream-100">{s.value}</p>
              <p className="mt-1 text-sm text-cream-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const reviews = [
    {
      name: "Farhana Rahman",
      role: "University Student",
      text: "BoiBondhu has been a lifesaver for my academic needs. The textbook collection is amazing, and delivery is always on time. Highly recommended for students!",
      rating: 5,
    },
    {
      name: "Tanvir Hasan",
      role: "Avid Reader",
      text: "I was impressed by the quality of the books. Every order arrives in perfect condition. The Bengali classic section is a treasure trove for literature lovers.",
      rating: 5,
    },
    {
      name: "Nusrat Jahan",
      role: "Teacher",
      text: "As a teacher, I regularly order books for myself and recommend them to students. BoiBondhu has the best prices and the most reliable service in Bangladesh.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-cream-200 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-2xl font-bold text-maroon-800 sm:text-3xl">
            What Our Readers Say
          </h2>
          <p className="mt-2 text-center text-cream-600">
            Trusted by thousands of book lovers across Bangladesh
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream-700">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-800 text-sm font-bold text-cream-100">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-maroon-800">
                    {r.name}
                  </p>
                  <p className="text-xs text-cream-600">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Newsletter ─── */
function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-green-600 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mt-2 text-green-100">
            Subscribe for new arrivals, exclusive deals, and reading recommendations.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border border-green-500 bg-white px-4 py-3 text-sm text-foreground placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-maroon-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-maroon-900 hover:-translate-y-0.5 active:translate-y-0">
            <Send className="h-4 w-4" />
            Subscribe
          </button>
        </motion.div>
        <p className="mt-3 text-xs text-green-200">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBooks />
      <Categories />
      <HowItWorks />
      <WhyBoiBondhu />
      <LiveStats />
      <Testimonials />
      <Newsletter />
    </>
  );
}
