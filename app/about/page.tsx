import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Jacob Zell",
  description:
    "Jacob Zell is a ceramicist based in Madison, Wisconsin. He makes wheel-thrown stoneware pottery at The Bodgery makerspace using MTM Brown clay from Paoli Clay Company.",
  alternates: { canonical: "/about" },
};

// Set this to your portrait photo path once you have one.
// Drop the file in public/images/ and update the path below.
const PORTRAIT_IMAGE: string | null = "/images/portrait.jpg";  // e.g. "/images/portrait.jpg"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-bark mb-4">
          About
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-earth leading-tight max-w-lg">
          Jacob Zell
        </h1>
      </div>

      {/* Main bio block */}
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start mb-20">
        <div className="aspect-[3/4] bg-gradient-to-br from-parchment to-sand relative overflow-hidden">
          {PORTRAIT_IMAGE && (
            <Image src={PORTRAIT_IMAGE} alt="Portrait" fill className="object-cover" />
          )}
        </div>

        <div className="md:pt-4 space-y-6 text-bark text-sm leading-relaxed">
          <p className="font-serif text-2xl md:text-3xl text-earth leading-snug">
            I make functional pottery in Madison, WI.
          </p>
          <p>
            What I&apos;m after is something earthy and vibrant at once a
            glaze that moves, a surface with enough depth that you catch yourself
            looking longer than you expected. Not decoration. Just an object that
            earns its place and keeps rewarding attention.
          </p>
          <p>
            I learned to throw seven years ago while finishing a computer science
            degree at the University of Wisconsin&ndash;Platteville. I needed
            something that existed entirely outside a screen.
            I work now as a software engineer, which makes the studio time feel
            necessary.
          </p>
          <p>
            I work out of{" "}
            <strong className="text-earth font-medium">The Bodgery</strong>, a
            nonprofit makerspace in Madison where I also volunteer as studio
            manager. My clay, MTM Brown stoneware, sourced from{" "}
            <strong className="text-earth font-medium">Paoli Clay Company</strong>{" "}
            in Paoli, WI, is a material with real character. The imperfections
            don&apos;t look like mistakes; they look like they belong. The
            Japanese call it wabi-sabi. I call it what I was going for. I fire
            in an electric kiln, which gives me control over the process.
          </p>
          <p>
            Everything I make is meant to last. I throw a little thicker than
            you&apos;d typically find, these aren&apos;t fragile objects. Treat
            them right and they&apos;ll outlive the cabinet they sit in. At the
            end of the day, stoneware is just fancy rocks.
          </p>
          <p>
            I sell at the Madison Farmers&apos; Market on Saturdays (May through
            November), at local shows throughout the year, and here.
          </p>
        </div>
      </div>

      {/* Process / values strip */}
      <div className="border-t border-sand pt-16 grid md:grid-cols-3 gap-10 mb-20">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">
            Materials
          </p>
          <p className="text-sm text-bark leading-relaxed">
            MTM Brown stoneware, sourced from Paoli Clay Company in Paoli, WI.
            A clay that makes the marks of making look intentional, earthy,
            warm, and built to last a lifetime.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">
            Process
          </p>
          <p className="text-sm text-bark leading-relaxed">
            Wheel-thrown, trimmed by hand, bisque fired, glazed, and fired
            again. Each piece takes about two weeks from clay to finished pot.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">
            Commissions
          </p>
          <p className="text-sm text-bark leading-relaxed">
            I take a small number of custom orders each season, dinnerware
            sets, gifts, and one-off pieces.{" "}
            <Link
              href="/contact"
              className="text-earth border-b border-earth hover:text-clay hover:border-clay transition-colors"
            >
              Get in touch
            </Link>{" "}
            if you have something in mind.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-sand pt-12 flex flex-col sm:flex-row gap-6">
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-earth border-b border-earth pb-0.5 hover:text-clay hover:border-clay transition-colors"
        >
          Shop the work →
        </Link>
        <Link
          href="/portfolio"
          className="text-xs tracking-widest uppercase text-bark border-b border-bark pb-0.5 hover:text-clay hover:border-clay transition-colors"
        >
          See the portfolio →
        </Link>
      </div>
    </div>
  );
}
