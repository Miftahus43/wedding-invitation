import React, { useState, useEffect } from "react";
import { WEDDING_CONFIG } from "../config/wedding";

interface FloatControlsProps {
  isVisible: boolean;
  isPlaying: boolean;
  onToggleMusic: () => void;
  guestName?: string;
}

const NAV_ITEMS = [
  {
    id: "profil",
    label: "Mempelai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    ),
  },
  {
    id: "story",
    label: "Cerita",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: "acara",
    label: "Acara",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: "galeri",
    label: "Galeri",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "rsvp",
    label: "RSVP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export function FloatControls({
  isVisible,
  isPlaying,
  onToggleMusic,
  guestName,
}: FloatControlsProps) {
  const [activeSection, setActiveSection] = useState<string>("profil");

  useEffect(() => {
    if (!isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: 0.1 }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isVisible]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Action Buttons (Music & Share) */}
      <div
        className={`float-controls ${isVisible ? "on" : ""}`}
        id="floatControls"
      >
        <button
          className={`fbtn ${!isPlaying ? "paused" : ""}`}
          id="musicBtn"
          data-testid="music-toggle-button"
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          onClick={onToggleMusic}
          type="button"
          aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
        >
          <div className="music-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>

      {/* Floating Bottom Navigation Dock */}
      <nav
        className={`bottom-nav-dock ${isVisible ? "on" : ""}`}
        aria-label="Navigasi Bagian Undangan"
      >
        <div className="nav-dock-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-dock-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => scrollToSection(item.id)}
              aria-label={`Menuju ke bagian ${item.label}`}
            >
              <span className="nav-dock-icon">{item.icon}</span>
              <span className="nav-dock-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

