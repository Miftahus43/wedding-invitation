import React from "react";
import { WEDDING_CONFIG } from "../config/wedding";

export function Closing() {
  return (
    <section id="closing" className="pad">
      <div
        className="closing-bg"
        style={{
          backgroundImage:
            'url("https://5kha3rsp76.ucarecd.net/a81ba1c2-5fbc-4c88-91c9-0c3bf0f4dd83/closing.jpeg")',
        }}
      />
      <div className="closing-shade" />
      <div className="wrap inner">
        <div
          className="gold-line reveal-el"
          style={{
            background: "linear-gradient(var(--gold-light), transparent)",
          }}
        />
        <p className="thanks reveal-el" style={{ marginTop: "30px" }}>
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <div style={{ margin: "36px 0" }} className="reveal-el">
          <span className="eyebrow" style={{ color: "#c9b48f" }}>
            Wassalamualaikum Wr. Wb.
          </span>
        </div>
        <div className="names serif reveal-el">
          {WEDDING_CONFIG.groom.name}
          <br />
          <span style={{ fontStyle: "italic", fontSize: "0.5em", color: "#dcc79f" }}>
            &amp;
          </span>
          <br />
          {WEDDING_CONFIG.bride.name}
        </div>
        <div className="closing-date reveal-el">
          <span>{WEDDING_CONFIG.event.dateShort}</span>
        </div>
        <p className="thanks reveal-el" style={{ marginTop: "20px" }}>
          Kami yang berbahagia beserta segenap keluarga besar
          <br />
          kedua mempelai.
        </p>
        {/* Supported By / Partners */}
        <div className="closing-partners reveal-el">
          <div className="partners-divider">
            <span className="partners-line" />
            <span className="partners-label">SUPPORTED BY</span>
            <span className="partners-line" />
          </div>

          <div className="partners-list">
            <a
              href="https://margasera.id"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-item"
              title="Margasera - Capture Moments"
            >
              <div className="partner-card">
                <img
                  src="/images/logo-margasera.png"
                  alt="Margasera - Capture Moments"
                  className="partner-logo partner-logo-margasera"
                  loading="lazy"
                />
              </div>
              <span className="partner-sub">Capture Moments</span>
            </a>

            <a
              href="https://madura.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-item"
              title="MaduraDev - Tech Partner"
            >
              <div className="partner-card">
                <img
                  src="/images/logo-maduradev.png"
                  alt="MaduraDev"
                  className="partner-logo partner-logo-maduradev"
                  loading="lazy"
                />
              </div>
              <span className="partner-sub">Tech Partner</span>
            </a>
          </div>
        </div>

        <div className="credit reveal-el">
          Created with &hearts; by AbrorilHuda
        </div>
      </div>
    </section>
  );
}
