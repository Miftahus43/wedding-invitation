import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

import { WEDDING_CONFIG } from "../config/wedding";

interface CoverProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  onBeforeOpen?: () => void;
}

export function Cover({ guestName, isOpen, onOpen, onBeforeOpen }: CoverProps) {
  const coverRef = useRef<HTMLDivElement>(null);
  const introRunRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const handleOpenInvitation = useCallback(() => {
    if (onBeforeOpen) {
      onBeforeOpen();
    }

    if (!coverRef.current) {
      onOpen();
      return;
    }

    gsap.to(coverRef.current, {
      yPercent: -100,
      opacity: 0.4,
      duration: 1.15,
      ease: "expo.inOut",
      onComplete: () => {
        if (coverRef.current) {
          coverRef.current.style.display = "none";
        }
        onOpen();
      },
    });
  }, [onBeforeOpen, onOpen]);

  useEffect(() => {
    if (introRunRef.current) return;
    introRunRef.current = true;

    const ctx = gsap.context(() => {
      const coverLines = coverRef.current?.querySelectorAll(".reveal-line > span");
      const coverFades = coverRef.current?.querySelectorAll(".fade-up");

      if (coverFades && coverFades.length > 0) {
        gsap.set(coverFades, { opacity: 0, y: 20 });
      }

      if (coverLines && coverLines.length > 0) {
        gsap.to(coverLines, {
          y: "0%",
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          delay: 0.15,
        });
      }

      if (coverFades && coverFades.length > 0) {
        gsap.to(coverFades, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.7,
        });
      }

      const bg = coverRef.current?.querySelector(".cover-bg");
      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.25 },
          { scale: 1.12, duration: 2.4, ease: "power2.out" }
        );
      }
    }, coverRef);

    return () => ctx.revert();
  }, []);

  // Handle Swipe Up Gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    // If swiped up by more than 50px
    if (diff > 50) {
      handleOpenInvitation();
    }
    touchStartY.current = null;
  };

  if (isOpen && (!coverRef.current || coverRef.current.style.display === "none")) {
    return null;
  }

  return (
    <div
      id="cover"
      ref={coverRef}
      style={isOpen ? { display: "none" } : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="cover-bg"
        style={{
          backgroundImage: "url('https://5kha3rsp76.ucarecd.net/1351a59b-3cfc-48dc-a703-6aa2137239f5/bgutama.jpeg')",
          filter: "brightness(0.48) contrast(1.1)",
        }}
      />
      <div className="cover-shade" />
      <div className="cover-grain" />

      <div className="cover-inner">
        <div className="cover-eyebrow-wrap fade-up">
          <span className="eyebrow cover-eyebrow">The Wedding Of</span>
        </div>

        <h1 className="cover-names">
          <span className="reveal-line">
            <span>{WEDDING_CONFIG.groom.name}</span>
          </span>
          <span className="cover-amp reveal-line">
            <span>&amp;</span>
          </span>
          <span className="reveal-line">
            <span>{WEDDING_CONFIG.bride.name}</span>
          </span>
        </h1>

        <div className="cover-date reveal-line">
          <span>{WEDDING_CONFIG.event.dateShort}</span>
        </div>

        <div className="guest-card fade-up">
          <div className="lbl">Kepada Yth. Bapak/Ibu/Saudara/i</div>
          <div className="nm" id="guestName" title={guestName || "Tamu Undangan"}>
            {guestName || "Tamu Undangan"}
          </div>
        </div>

        <button
          className="open-btn fade-up"
          id="openBtn"
          data-testid="open-invitation-button"
          onClick={handleOpenInvitation}
          type="button"
          aria-label="Buka Undangan Pernikahan"
        >
          Buka Undangan
          <svg
            className="ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>

        <div
          className="cover-scrolltease fade-up"
          onClick={handleOpenInvitation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenInvitation();
          }}
        >
          <span>Ketuk atau usap ke atas untuk membuka</span>
          <svg
            className="swipe-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

