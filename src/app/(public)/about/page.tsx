import { BookOpen, Shield, Heart, Truck, Users, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - BoiBondhu",
  description: "Learn about BoiBondhu's mission to make quality books accessible to every reader in Bangladesh.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Quality First",
      desc: "Every book goes through a quality check before it reaches you. We never sell damaged or pirated copies.",
    },
    {
      icon: Heart,
      title: "Reader-Centric",
      desc: "We exist for readers. From curated recommendations to hassle-free returns, every decision starts with you.",
    },
    {
      icon: Target,
      title: "Affordable Access",
      desc: "We believe knowledge should be accessible. Our pricing ensures students and book lovers can buy without breaking the bank.",
    },
    {
      icon: Users,
      title: "Community Driven",
      desc: "Built by readers, for readers. Our reviews, ratings, and recommendations come from the community.",
    },
  ];

  return (
    <div className="bg-cream-200 min-h-screen">
      {/* Hero */}
      <section className="bg-maroon-800 py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 animate-fade-in-up">
          <BookOpen className="mx-auto h-12 w-12 text-cream-200" />
          <h1 className="mt-4 text-3xl font-bold text-cream-100 sm:text-4xl">
            About BoiBondhu
          </h1>
          <p className="mt-4 text-lg text-cream-300">
            We are on a mission to build the largest and most trusted online bookstore in Bangladesh, connecting readers with the stories that shape their lives.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 animate-fade-in-up">
          <div>
            <h2 className="text-2xl font-bold text-maroon-800">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-cream-700">
              BoiBondhu was born from a simple belief: every person in Bangladesh deserves easy access to quality books. Whether you are a university student in Dhaka, a teacher in Sylhet, or a book lover in a remote village, we want to deliver the world of literature to your doorstep.
            </p>
            <p className="mt-4 leading-relaxed text-cream-700">
              Founded in 2024, we started with a small collection of Bengali classics and have grown to over 10,000 titles spanning academic textbooks, international fiction, self-help, poetry, comics, and more. Our catalog is curated by real readers who understand what makes a book worth your time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "10,000+", label: "Books Available" },
              { num: "25,000+", label: "Orders Delivered" },
              { num: "15,000+", label: "Happy Readers" },
              { num: "64", label: "Districts Covered" },
            ].map((s, i) => (
              <div key={s.label} className="rounded-xl bg-white border border-cream-200 p-5 text-center animate-fade-in-up transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-2xl font-bold text-green-600">{s.num}</p>
                <p className="mt-1 text-sm text-cream-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 animate-fade-in-up">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-maroon-800">Our Core Values</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-cream-200 bg-cream-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-maroon-800">{v.title}</h3>
                <p className="mt-2 text-sm text-cream-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-16 text-center animate-fade-in-up">
        <div className="mx-auto max-w-xl px-4">
          <Truck className="mx-auto h-10 w-10 text-white" />
          <h2 className="mt-4 text-2xl font-bold text-white">Ready to Start Reading?</h2>
          <p className="mt-2 text-green-100">
            Browse our collection and discover your next favorite book today.
          </p>
          <a
            href="/explore"
            className="mt-6 inline-block rounded-xl bg-maroon-800 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-maroon-900"
          >
            Explore Books
          </a>
        </div>
      </section>
    </div>
  );
}
