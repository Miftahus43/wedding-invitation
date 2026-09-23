import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { sendRsvp, type RsvpPayload } from "../services/weddingService";
import { containsProfanity } from "../utils/contentFilter";

const RSVP_COOLDOWN_DURATION = 15; // 15 seconds cooldown between RSVP submissions

interface RsvpProps {
  initialName?: string;
  hasPersonalInvite?: boolean;
  onShowToast: (msg: string) => void;
  onSubmitSuccess?: (rsvpData: RsvpPayload) => void;
}

export function Rsvp({
  initialName = "",
  hasPersonalInvite = false,
  onShowToast,
  onSubmitSuccess,
}: RsvpProps) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"Hadir" | "Tidak Hadir">("Hadir");
  const [count, setCount] = useState("1 Orang");
  const [savedRsvp, setSavedRsvp] = useState<RsvpPayload | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-spam states
  const [honeypot, setHoneypot] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Load existing RSVP from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("my_wedding_rsvp");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setSavedRsvp(parsed);
          setName(parsed.name);
          setStatus(parsed.status || "Hadir");
          setCount(parsed.count || "1 Orang");
          if (onSubmitSuccess) {
            onSubmitSuccess(parsed);
          }
        }
      }
    } catch (e) {
      // Ignore localStorage error
    }
  }, []);

  // Check existing cooldown on mount
  useEffect(() => {
    try {
      const lastRsvpTime = localStorage.getItem("wedding_last_rsvp_time");
      if (lastRsvpTime) {
        const elapsed = Math.floor((Date.now() - parseInt(lastRsvpTime, 10)) / 1000);
        if (elapsed < RSVP_COOLDOWN_DURATION) {
          setCooldown(RSVP_COOLDOWN_DURATION - elapsed);
        }
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Cooldown countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Sync name from prop if provided
  useEffect(() => {
    if (initialName && !name && !savedRsvp) {
      setName(initialName);
    }
  }, [initialName, name, savedRsvp]);

  useEffect(() => {
    if (hasPersonalInvite && initialName && (!savedRsvp || isEditing)) {
      setName(initialName);
    }
  }, [hasPersonalInvite, initialName, savedRsvp, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Verification check: Must have personal invite (?to=) or previously saved RSVP
    if (!hasPersonalInvite && !savedRsvp) {
      onShowToast("Konfirmasi kehadiran hanya untuk tamu dengan tautan undangan resmi");
      return;
    }

    // 1. Honeypot check (bot trap)
    if (honeypot.trim() !== "") {
      onShowToast("Konfirmasi kehadiran berhasil disimpan! ✦");
      return;
    }

    // 2. Cooldown check
    if (cooldown > 0) {
      onShowToast(`Mohon tunggu ${cooldown} detik sebelum memperbarui lagi`);
      return;
    }

    // Determine final name (locked to invitation link if personal invite present)
    const effectiveName = hasPersonalInvite && initialName
      ? initialName.trim()
      : savedRsvp && isEditing
      ? savedRsvp.name
      : name.trim();

    if (!effectiveName || effectiveName.length < 2) {
      onShowToast("Mohon isi nama lengkap Anda (min. 2 karakter)");
      return;
    }

    if (effectiveName.length > 80) {
      onShowToast("Nama maksimal 80 karakter");
      return;
    }

    if (containsProfanity(effectiveName)) {
      onShowToast("Nama mengandung kata tidak pantas. Mohon gunakan nama yang sopan.");
      return;
    }

    setIsSubmitting(true);

    // Trigger celebration if Hadir
    if (status === "Hadir") {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#b48a4a", "#c9a56a", "#f7f1e7", "#e4d3be"],
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    const rsvpPayload: RsvpPayload = {
      name: effectiveName,
      status,
      count: status === "Hadir" ? count : "0 Orang",
      timestamp: new Date().toISOString(),
    };

    try {
      await sendRsvp(rsvpPayload);
      setSavedRsvp(rsvpPayload);
      setIsEditing(false);

      // Start cooldown
      setCooldown(RSVP_COOLDOWN_DURATION);
      try {
        localStorage.setItem("wedding_last_rsvp_time", Date.now().toString());
      } catch (e) {
        // Ignore
      }

      onShowToast(`Konfirmasi kehadiran berhasil dikirim! ✦`);

      if (onSubmitSuccess) {
        onSubmitSuccess(rsvpPayload);
      }
    } catch (err) {
      onShowToast("Gagal menyimpan konfirmasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-beige pad" id="rsvp">
      <div className="wrap" style={{ textAlign: "center" }}>
        <span className="num-tag reveal-el">05 — Konfirmasi</span>
        <h2 className="title reveal-el" style={{ marginTop: "10px" }}>
          RSVP
        </h2>
        <p
          className="lede reveal-el"
          style={{ margin: "16px auto 36px", textAlign: "center" }}
        >
          Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan hari
          istimewa ini.
        </p>

        {savedRsvp && !isEditing ? (
          <div className="rsvp-confirmed-card reveal-el">
            <div className="confirmed-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="confirmed-title serif">Konfirmasi Terkirim</div>
            <div className="confirmed-name">{savedRsvp.name}</div>
            <div className="confirmed-badge">
              Status: <strong>{savedRsvp.status}</strong>
              {savedRsvp.status === "Hadir" && ` (${savedRsvp.count})`}
            </div>
            <p className="confirmed-msg">
              Terima kasih, konfirmasi kehadiran Anda telah diterima. 🤍
            </p>
            <button
              type="button"
              className="btn-edit-rsvp"
              onClick={() => setIsEditing(true)}
            >
              Ubah Konfirmasi
            </button>
          </div>
        ) : !hasPersonalInvite && !savedRsvp ? (
          <div className="rsvp-locked-card reveal-el">
            <div className="locked-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="serif locked-title">Khusus Tamu Undangan</h3>
            <p className="locked-desc">
              Mohon maaf, formulir konfirmasi kehadiran (RSVP) hanya dapat diisi melalui tautan undangan personal yang dikirimkan langsung oleh kedua mempelai.
            </p>
            <div className="rsvp-locked-note">
              <span className="locked-sparkle">✦</span>
              <span>Pastikan membuka undangan melalui tautan personal yang memuat nama Anda.</span>
            </div>
          </div>
        ) : (
          <form
            id="rsvpForm"
            className="reveal-el"
            style={{ textAlign: "left" }}
            onSubmit={handleSubmit}
          >
            {/* Honeypot field (hidden from real users) */}
            <div
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                height: 0,
                width: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="user_confirm_trap"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <div className="field-label-row">
                <label htmlFor="rsvpNama">Nama Lengkap</label>
                {(hasPersonalInvite || (savedRsvp && isEditing)) && (
                  <span className="field-badge-locked">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Terkunci
                  </span>
                )}
              </div>
              <input
                type="text"
                id="rsvpNama"
                placeholder={hasPersonalInvite ? "" : "Nama Anda"}
                required
                maxLength={80}
                data-testid="rsvp-name-input"
                readOnly={hasPersonalInvite || Boolean(savedRsvp && isEditing)}
                className={(hasPersonalInvite || Boolean(savedRsvp && isEditing)) ? "input-locked" : ""}
                value={name}
                onChange={(e) => {
                  if (!hasPersonalInvite && !(savedRsvp && isEditing)) {
                    setName(e.target.value);
                  }
                }}
              />
              {(hasPersonalInvite || Boolean(savedRsvp && isEditing)) && (
                <span className="field-hint">Nama terisi otomatis dari tautan undangan personal Anda.</span>
              )}
            </div>

            <div className="field">
              <label>Konfirmasi Kehadiran</label>
              <div className="radio-row">
                <label
                  data-testid="rsvp-hadir"
                  className={status === "Hadir" ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="hadir"
                    value="Hadir"
                    checked={status === "Hadir"}
                    onChange={() => setStatus("Hadir")}
                  />
                  <span>Hadir</span>
                </label>
                <label
                  data-testid="rsvp-tidak"
                  className={status === "Tidak Hadir" ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="hadir"
                    value="Tidak Hadir"
                    checked={status === "Tidak Hadir"}
                    onChange={() => setStatus("Tidak Hadir")}
                  />
                  <span>Tidak Hadir</span>
                </label>
              </div>
            </div>

            {status === "Hadir" && (
              <div className="field">
                <label htmlFor="rsvpJumlah">Jumlah Tamu</label>
                <div className="guest-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    aria-label="Kurangi jumlah tamu"
                    onClick={() => {
                      const num = parseInt(count, 10) || 1;
                      if (num > 1) setCount(`${num - 1} Orang`);
                    }}
                    disabled={parseInt(count, 10) <= 1}
                  >
                    −
                  </button>
                  <span className="stepper-value serif">{count}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    aria-label="Tambah jumlah tamu"
                    onClick={() => {
                      const num = parseInt(count, 10) || 1;
                      if (num < 4) setCount(`${num + 1} Orang`);
                    }}
                    disabled={parseInt(count, 10) >= 4}
                  >
                    +
                  </button>
                  <select
                    id="rsvpJumlah"
                    data-testid="rsvp-count-select"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                    tabIndex={-1}
                  >
                    <option value="1 Orang">1 Orang</option>
                    <option value="2 Orang">2 Orang</option>
                    <option value="3 Orang">3 Orang</option>
                    <option value="4 Orang">4 Orang</option>
                  </select>
                </div>
              </div>
            )}

            <div className="rsvp-btn-row">
              {isEditing && savedRsvp && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1 }}
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="btn btn-solid btn-full"
                data-testid="rsvp-submit-button"
                disabled={isSubmitting || cooldown > 0}
                style={{
                  flex: 2,
                  opacity: cooldown > 0 ? 0.75 : 1,
                  cursor: cooldown > 0 ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : cooldown > 0
                  ? `Tunggu ${cooldown}d...`
                  : savedRsvp
                  ? "Perbarui Konfirmasi"
                  : "Kirim Konfirmasi Kehadiran"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

