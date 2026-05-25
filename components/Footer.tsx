import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sand bg-parchment">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-bark">
        <div>
          <p className="font-sans text-base tracking-widest uppercase text-earth mb-1">
            Oi Ceramics
          </p>
          <p>Handmade pottery. Madison, Wisconsin.</p>
        </div>
        <div className="flex flex-col gap-1">
          <Link href="/shop" className="hover:text-earth transition-colors">
            Shop
          </Link>
          <Link href="/portfolio" className="hover:text-earth transition-colors">
            Portfolio
          </Link>
          <Link href="/about" className="hover:text-earth transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-earth transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <a
            href="https://www.instagram.com/oi__ceramics"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-earth transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            @oi__ceramics
          </a>
          <a
            href="mailto:oiceramicsmadison@gmail.com"
            className="hover:text-earth transition-colors"
          >
            oiceramicsmadison@gmail.com
          </a>
        </div>
        <div className="text-xs text-ash mt-auto">
          © {new Date().getFullYear()} Oi Ceramics
        </div>
      </div>
    </footer>
  );
}
