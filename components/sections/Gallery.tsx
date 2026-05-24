"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const photos = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Wedding moment 1",
    caption: "Together Forever",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Wedding moment 2",
    caption: "Our Special Day",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Wedding moment 3",
    caption: "Love & Joy",
  },
];

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      style={{
        backgroundColor: "var(--color-charcoal)",
        padding: "6rem 1.5rem",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Captured Moments
        </motion.p>
        <motion.h2
          className="section-title"
          style={{ marginTop: "0.75rem", color: "white" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Our Gallery
        </motion.h2>
        <motion.div
          className="gold-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            onClick={() => openLightbox(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              aspectRatio: index % 3 === 0 ? "4/5" : "1/1",
              backgroundColor: "var(--color-charcoal-light)",
            }}
          >
            {/* Photo */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.5s ease",
                transform:
                  hoveredIndex === index ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                opacity: hoveredIndex === index ? 1 : 0,
                transition: "opacity 0.3s ease",
                display: "flex",
                alignItems: "flex-end",
                padding: "1.25rem",
              }}
            >
              {/* Caption */}
              <motion.div
                initial={false}
                animate={{
                  y: hoveredIndex === index ? 0 : 10,
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    color: "white",
                    marginBottom: "0.2rem",
                  }}
                >
                  {photo.caption}
                </p>
                <div
                  style={{
                    width: "2rem",
                    height: "1px",
                    backgroundColor: "var(--color-gold)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </section>
  );
}