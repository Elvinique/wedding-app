"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding.config";

export default function Footer() {
  const { bride, groom, hashtag } = weddingConfig.couple;

  const handleElviniqueClick = () => {
    const message = `Hello Elvinique Systems! 👋\n\nI just visited the wedding website you built for ${bride} & ${groom} and I'm impressed with the quality.\n\nI would love to get a premium wedding website for my own special day. Could you please share more details about your packages and pricing?\n\nThank you! 🌟`;
    const whatsappURL = `https://wa.me/2348029054399?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--color-charcoal)",
        padding: "4rem 1.5rem 2rem",
      }}
    >
      {/* Top Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "0.75rem",
          }}
        >
          {weddingConfig.date.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: "white",
            margin: "0 0 0.5rem",
            lineHeight: 1.2,
          }}
        >
          {bride}{" "}
          <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>
            &
          </span>{" "}
          {groom}
        </h2>

        <div
          style={{
            width: "48px",
            height: "1px",
            backgroundColor: "var(--color-gold)",
            margin: "1rem auto",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(247,242,234,0.35)",
          }}
        >
          {hashtag}
        </p>
      </div>

      {/* Info Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(1.5rem, 5vw, 3rem)",
          flexWrap: "wrap",
          marginBottom: "3rem",
        }}
      >
        {[
          {
            label: "Ceremony",
            value: `${weddingConfig.ceremony.name}`,
            sub: weddingConfig.ceremony.time,
          },
          {
            label: "Reception",
            value: `${weddingConfig.reception.name}`,
            sub: weddingConfig.reception.time,
          },
          {
            label: "Location",
            value: "Port Harcourt",
            sub: "Nigeria",
          },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "0.35rem",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "rgba(247,242,234,0.7)",
                marginBottom: "0.15rem",
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                color: "rgba(247,242,234,0.4)",
              }}
            >
              {item.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Nav Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(1rem, 3vw, 2rem)",
          flexWrap: "wrap",
          marginBottom: "3rem",
          borderTop: "1px solid rgba(198,166,100,0.1)",
          borderBottom: "1px solid rgba(198,166,100,0.1)",
          padding: "1.5rem 0",
        }}
      >
        {[
          { label: "Our Story", href: "#story" },
          { label: "Venues", href: "#details" },
          { label: "RSVP", href: "#rsvp" },
          { label: "Gallery", href: "#gallery" },
          { label: "Gifts", href: "#gifts" },
          { label: "Guestbook", href: "#guestbook" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(247,242,234,0.45)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(247,242,234,0.45)";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: "rgba(247,242,234,0.2)",
            margin: 0,
          }}
        >
          © 2026 {bride} & {groom}. All rights reserved.
        </p>

        {/* Elvinique Systems Button */}
        <motion.button
          onClick={handleElviniqueClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "transparent",
            border: "1px solid rgba(198,166,100,0.25)",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-gold)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(198,166,100,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(198,166,100,0.25)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(247,242,234,0.35)",
            }}
          >
            Crafted by
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.85rem",
              color: "var(--color-gold)",
              letterSpacing: "0.05em",
            }}
          >
            Elvinique Systems
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-gold)",
              opacity: 0.7,
            }}
          >
            ↗
          </span>
        </motion.button>
      </div>
    </footer>
  );
}