"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const photos = [
    { src: "/images/gallery-1.jpg", alt: "Wedding moment 1" },
    { src: "/images/gallery-2.jpg", alt: "Wedding moment 2" },
    { src: "/images/gallery-3.jpg", alt: "Wedding moment 3" },
    { src: "/images/gallery-4.jpg", alt: "Wedding moment 4" },
    { src: "/images/gallery-5.jpg", alt: "Wedding moment 5" },
    { src: "/images/gallery-6.jpg", alt: "Wedding moment 6" },
];

export default function Gallery() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

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
                        style={{
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            aspectRatio: index % 3 === 0 ? "4/5" : "1/1",
                            backgroundColor: "var(--color-charcoal-light)",
                        }}
                    >
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
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLImageElement).style.transform =
                                    "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLImageElement).style.transform =
                                    "scale(1)";
                            }}
                        />

                        {/* Hover Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.opacity = "0";
                            }}
                        />
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