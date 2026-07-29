"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  async function onSubmit(data: ContactForm) {
    setLoading(true);
    try {
      await api("/api/contact", {
        method: "POST",
        json: data,
      });
      toast.success("Message sent! We will get back to you within 24 hours.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-cream-200 min-h-screen">
      <section className="bg-maroon-800 py-16 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-cream-100">Contact Us</h1>
          <p className="mt-2 text-cream-300">We would love to hear from you. Reach out anytime.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 animate-fade-in-up">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Visit Us", lines: ["42/2 Mirpur Road", "Dhaka 1216, Bangladesh"] },
              { icon: Phone, title: "Call Us", lines: ["+880 1712-345678", "Sat-Thu: 9AM - 8PM"] },
              { icon: Mail, title: "Email Us", lines: ["hello@boibondhu.com", "support@boibondhu.com"] },
            ].map((c) => (
              <div key={c.title} className="flex gap-4 rounded-xl border border-cream-200 bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-maroon-800">{c.title}</p>
                  {c.lines.map((l) => (
                    <p key={l} className="text-sm text-cream-600">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-maroon-800">Send a Message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Name</label>
                  <input {...register("name", { required: "Required" })}
                    className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-cream-600">Email</label>
                  <input type="email" {...register("email", { required: "Required" })}
                    className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-cream-600">Subject</label>
                <input {...register("subject", { required: "Required" })}
                  className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-cream-600">Message</label>
                <textarea rows={5} {...register("message", { required: "Required" })}
                  className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
