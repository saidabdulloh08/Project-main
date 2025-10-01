// components/Header.tsx
"use client";

import { useAppContext } from "@/lib/context";
import Link from "next/link";
import { LanguageKey } from "@/lib/types";
import { useEffect, useState } from "react"; // useState Header'da mobil menuni boshqarish uchun qo'shildi
import "./Header.css";

export default function Header() {
  const { currentLang, setLang, isDarkMode, toggleTheme, getContent } =
    useAppContext();
  const links = getContent().header.links;
  const langOptions: LanguageKey[] = ["uzb", "rus", "eng"];
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menyu holati
  const [mounted, setMounted] = useState(false);
  const primaryColorStyle = { color: "var(--icp-primary)" };
  const accentColorStyle = { color: "var(--icp-accent)" };

  // Mobil menuni yopish uchun funksiya
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Logo va shior */}
        <div className="logo-container">
          <div className="flex flex-col">
            <h1 className="logo-text">ICP</h1>
            <p className="logo-tagline">INNOVATE • CREATE • PERFORM</p>
          </div>
        </div>

        {/* Navigatsiya Linklari (Desktop/Tablet) */}
        <nav className="hidden md:flex nav-links-desktop">
          {links.map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="nav-link">
              {link}
            </a>
          ))}
        </nav>

        {/* Boshqaruv elementlari va Mobil tugma */}
        <div className="controls-container">
          {/* Til almashtirish */}
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value as LanguageKey)}
            className="lang-select">
            {langOptions.map((lang) => (
              <option
                key={lang}
                value={lang}
                style={{ color: "#1f2937", backgroundColor: "#ffffff" }}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Rejim almashtirish */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            style={accentColorStyle}
            aria-label="Toggle dark mode">
            {mounted ? (isDarkMode ? "🌞" : "🌙") : null}
          </button>

          {/* Mobil menyu tugmasi (FAQAT mobil uchun) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="menu-toggle"
            style={accentColorStyle}
            aria-label="Toggle navigation menu">
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobil menyu (ochiluvchi) */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <nav className="flex flex-col p-4 gap-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="nav-link-mobile"
              onClick={handleLinkClick}>
              {link}
            </a>
          ))}
          <Link
            href="/adminPanel"
            className="nav-link-mobile admin-link-mobile"
            onClick={handleLinkClick}>
            Admin Panel
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .nav-links-desktop {
          display: none;
          gap: 1.5rem;
        }
        .menu-toggle {
          display: block; /* Mobil telefonda ko'rinadi */
        }
        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, background-color 0.3s;
          background-color: var(--bg-secondary);
          width: 100%;
        }
        .mobile-menu.open {
          max-height: 500px; /* Ochish uchun yetarli balandlik */
        }
        .nav-link-mobile {
          display: block;
          padding: 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 500;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-color);
          transition: color 0.3s;
        }
        .nav-link-mobile:hover {
          color: var(--icp-accent);
        }
        .admin-link-mobile {
          color: var(--icp-primary);
          font-weight: 700;
          border-bottom: none;
          margin-top: 0.5rem;
        }

        /* Desktop/Tablet uchun media query */
        @media (min-width: 768px) {
          .nav-links-desktop {
            display: flex;
          }
          .menu-toggle {
            display: none; /* Desktopda yashirish */
          }
        }
      `}</style>
    </header>
  );
}
