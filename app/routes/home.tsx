import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import type { Route } from "./+types/home";
import { Cover } from "../components/Cover";
import { Ayat } from "../components/Ayat";
import { Profil } from "../components/Profil";
import { LoveStory } from "../components/LoveStory";
import { Marquee } from "../components/Marquee";
import { EventDetails } from "../components/EventDetails";
import { Countdown } from "../components/Countdown";
import { Gallery, GALLERY_PHOTOS } from "../components/Gallery";
import { Lightbox } from "../components/Lightbox";
import { Rsvp } from "../components/Rsvp";
import { Guestbook } from "../components/Guestbook";
import { DigitalGift } from "../components/DigitalGift";
import { Closing } from "../components/Closing";
import { FloatControls } from "../components/FloatControls";
import { AudioPlayer } from "../components/AudioPlayer";
import { Toast } from "../components/Toast";
import { WEDDING_CONFIG } from "../config/wedding";
import { sanitizeGuestName, containsProfanity } from "../utils/contentFilter";

export function meta({ location }: Route.MetaArgs) {
  const search = new URLSearchParams(location.search);
  const rawTo = search.get("to");
  const cleanedTo = sanitizeGuestName(rawTo);
  const isCustomGuest = cleanedTo !== "Tamu Undangan";
  const guestTitle = isCustomGuest
    ? `Undangan Pernikahan untuk ${cleanedTo} - ${WEDDING_CONFIG.coupleName}`
    : `${WEDDING_CONFIG.coupleName} - Undangan Pernikahan`;
  const siteUrl = WEDDING_CONFIG.siteUrl ? WEDDING_CONFIG.siteUrl.replace(/\/$/, "") : "";
  const ogImageUrl = siteUrl ? `${siteUrl}/og-image.png` : "/og-image.png";
  const canonicalUrl = siteUrl ? `${siteUrl}${location.pathname}${location.search}` : undefined;

  return [
    { title: guestTitle },
    {
      name: "description",
      content: `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk hadir di hari bahagia kami. ${WEDDING_CONFIG.coupleName} — ${WEDDING_CONFIG.event.dateDisplay}.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: guestTitle },
    {
      property: "og:description",
      content: `Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir. ${WEDDING_CONFIG.event.dateDisplay}.`,
    },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: guestTitle },
    {
      name: "twitter:description",
      content: `Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir. ${WEDDING_CONFIG.event.dateDisplay}.`,
    },
    { name: "twitter:image", content: ogImageUrl },
  ];
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const rawTo = searchParams.get("to");
  const autoOpen = searchParams.get("open") === "1";

  const guestName = sanitizeGuestName(rawTo);
  const hasPersonalInvite = Boolean(rawTo && rawTo.trim().length > 0 && !containsProfanity(rawTo));

  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // RSVP state to unlock Guestbook
  const [userRsvp, setUserRsvp] = useState<import("../services/weddingService").RsvpPayload | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2600);
  }, []);

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.55;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            showToast("Musik tidak dapat diputar otomatis");
          });
      }
    }
  }, [isPlaying, showToast]);

  const initAnimations = useCallback(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis Smooth Scroll
    try {
      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    } catch (e) {
      // Fallback native scroll
    }

    // Scroll reveal animations
    const revealElements = document.querySelectorAll(".reveal-el");
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        }
      );
    });

    // Story photo parallax
    const storyImgs = document.querySelectorAll(".story-photo img");
    storyImgs.forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    // Closing photo parallax
    const closingBg = document.querySelector("#closing .closing-bg");
    if (closingBg) {
      gsap.to(closingBg, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: "#closing",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Infinite Marquee
    const marqueeTrack = document.querySelector("#marqueeTrack");
    if (marqueeTrack) {
      gsap.to(marqueeTrack, {
        xPercent: -50,
        ease: "none",
        repeat: -1,
        duration: 18,
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  }, []);

  const handleOpenInvitation = useCallback(() => {
    setIsOpen(true);
    document.body.classList.remove("locked");

    playMusic();

    setTimeout(() => {
      initAnimations();
    }, 100);
  }, [playMusic, initAnimations]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.add("locked");
    } else {
      document.body.classList.remove("locked");
      initAnimations();
    }

    return () => {
      document.body.classList.remove("locked");
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [isOpen, initAnimations]);

  // Handle Photo click in gallery
  const handlePhotoClick = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
  };

  return (
    <>
      <Cover
        guestName={guestName}
        isOpen={isOpen}
        onOpen={handleOpenInvitation}
        onBeforeOpen={playMusic}
      />

      <FloatControls
        isVisible={isOpen}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
        guestName={rawTo ? guestName : undefined}
      />

      <AudioPlayer
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      <main id="main" className={isOpen ? "show" : ""}>
        <Ayat />
        <Profil />
        <LoveStory />
        <Marquee />
        <EventDetails onShowToast={showToast} />
        <Countdown />
        <Gallery onPhotoClick={handlePhotoClick} />
        <Rsvp
          initialName={hasPersonalInvite ? guestName : ""}
          hasPersonalInvite={hasPersonalInvite}
          onShowToast={showToast}
          onSubmitSuccess={(data) => setUserRsvp(data)}
        />
        <Guestbook
          initialName={rawTo ? guestName : ""}
          userRsvp={userRsvp}
          onShowToast={showToast}
        />
        <DigitalGift onShowToast={showToast} />
        <Closing />
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={activePhotoIndex}
        photos={GALLERY_PHOTOS}
        onClose={handleCloseLightbox}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
