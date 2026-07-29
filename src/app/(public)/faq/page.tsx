"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    q: "How do I place an order?",
    a: "Browse our catalog on the Explore page, find the book you want, and click 'Buy Now'. Fill in your shipping address and choose a payment method. You will receive an order confirmation immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), bKash, Nagad, and credit/debit cards. COD is the most popular option and is available for all orders across Bangladesh.",
  },
  {
    q: "How long does delivery take?",
    a: "Dhaka delivery takes 2-3 business days. For other divisions, expect 4-5 business days. Remote areas may take up to 7 business days. You will receive tracking updates via SMS and email.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy. If you are not satisfied with your book, contact our support team within 7 days of delivery. The book must be in its original condition. Refunds are processed within 5-7 business days.",
  },
  {
    q: "Are the books original or photocopies?",
    a: "We only sell genuine, original books. Every book in our inventory is sourced directly from publishers or authorized distributors. We have a zero-tolerance policy for pirated or photocopy materials.",
  },
  {
    q: "Can I track my order?",
    a: "Yes! Once your order is dispatched, you will receive a tracking link via SMS and email. You can also check your order status in the 'My Orders' section of your account dashboard.",
  },
  {
    q: "Do you offer bulk or institutional orders?",
    a: "Absolutely. We offer special pricing for bulk orders (10+ books), university departments, schools, and libraries. Contact us at hello@boibondhu.com or call +880 1712-345678 for a custom quote.",
  },
  {
    q: "How do I become a seller on BoiBondhu?",
    a: "We are currently curating our catalog through direct publisher partnerships. If you are a publisher or distributor interested in working with us, please reach out via our Contact page or email partnerships@boibondhu.com.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-cream-200 min-h-screen">
      <section className="bg-maroon-800 py-16 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-cream-100">Frequently Asked Questions</h1>
          <p className="mt-2 text-cream-300">Everything you need to know about BoiBondhu</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3 animate-fade-in-up">
          {faqData.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-cream-200 bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-maroon-800 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-cream-500 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-cream-200 px-5 py-4">
                  <p className="text-sm leading-relaxed text-cream-700">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-green-600 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Still have questions?</h2>
          <p className="mt-2 text-green-100">
            Our support team is available Sat-Thu, 9AM to 8PM.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:hello@boibondhu.com"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50"
            >
              Email Support
            </a>
            <a
              href="tel:+8801712345678"
              className="rounded-xl border border-white px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
