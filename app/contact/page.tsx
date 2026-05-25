"use client";

import { useState } from "react";

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.3em] uppercase text-bark mb-4">
          Contact
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-earth mb-10">
          Get in touch.
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="text-sm text-bark space-y-3">
            <p>Questions about a piece, custom orders, or wholesale inquiries — reach out below or send a direct email.</p>
            <p>I&apos;m also available for local pickup in Madison.</p>
            <div className="pt-1 space-y-2">
              <a
                href="mailto:oiceramicsmadison@gmail.com"
                className="flex items-center gap-2 text-earth hover:text-clay transition-colors"
              >
                <EmailIcon />
                oiceramicsmadison@gmail.com
              </a>
              <a
                href="https://www.instagram.com/oi__ceramics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-earth hover:text-clay transition-colors"
              >
                <InstagramIcon />
                @oi__ceramics
              </a>
            </div>
          </div>
          <div className="text-sm text-bark space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase text-ash mb-3">
              Where to find me
            </p>
            <p>Madison Farmers&apos; Market — Saturdays, May–Nov</p>
          </div>
        </div>

        {status === "sent" ? (
          <div className="border border-sage-light bg-sage-light/20 px-6 py-8 text-center">
            <p className="font-serif text-2xl text-earth mb-2">
              Message received.
            </p>
            <p className="text-sm text-bark">
              I&apos;ll be in touch within a few days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-bark block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-sand bg-transparent px-4 py-3 text-sm text-earth placeholder:text-ash focus:outline-none focus:border-bark transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-bark block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-sand bg-transparent px-4 py-3 text-sm text-earth placeholder:text-ash focus:outline-none focus:border-bark transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-bark block mb-2">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-sand bg-transparent px-4 py-3 text-sm text-earth placeholder:text-ash focus:outline-none focus:border-bark transition-colors resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            {status === "error" && (
              <p className="text-xs text-clay">
                Something went wrong. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-earth text-cream text-sm tracking-widest uppercase px-8 py-3 hover:bg-bark transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
