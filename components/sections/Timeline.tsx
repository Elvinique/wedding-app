"use client";

import { motion } from "framer-motion";

const events = [
    {
        year: "Once Upon a Time",
        title: "A Name I Already Knew",
        description:
            "She was a teenager when she first heard his name — Dumpe — the same surname as her family. He lived in the neighborhood, close to her family, yet their paths never crossed. She knew his name but had never seen his face.",
        icon: "✦",
    },
    {
        year: "1st December 2025",
        title: "The Friend Request",
        description:
            "A Facebook friend request changed everything. Little did she know that accepting it would lead her straight to the love of her life. One click — and forever began.",
        icon: "♡",
    },
    {
        year: "A Week Later",
        title: "Love at First Sight",
        description:
            "Their first date arrived, and for her it was unmistakable — love at first sight. His style, his smile, his lips, his humor, and the way he made her heart feel safe and alive all at once. Saying yes to being his girlfriend came naturally.",
        icon: "◇",
    },
    {
        year: "28th December 2025",
        title: "He Asked, She Said Yes",
        description:
            "He got down on one knee and asked her to marry him. Without a moment's hesitation, her answer was yes. He had already been dreaming of making her his wife — and now she knew it too.",
        icon: "❋",
    },
    {
        year: "January 2026",
        title: "Two Families, One Forever",
        description:
            "He came with his family to seek her hand in marriage. It was the beautiful, official beginning of their forever — two families becoming one.",
        icon: "◈",
    },
    {
        year: "Today",
        title: "My King, My Crown",
        description:
            "You are not just my husband, but my best friend, my peace, and my favorite person in the world. Loving you feels effortless. Cheers to forever with you. ❤️",
        icon: "♔",
    },
];

export default function Timeline() {
    return (
        <section
            style={{
                backgroundColor: "var(--color-cream)",
                padding: "6rem 1.5rem",
            }}
            id="story"
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
                    Our Journey
                </motion.p>
                <motion.h2
                    className="section-title"
                    style={{ marginTop: "0.75rem" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    The Love Story
                </motion.h2>
                <motion.div
                    className="gold-divider"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
            </div>

            {/* Timeline */}
            <div
                style={{
                    maxWidth: "680px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Vertical Line — hidden on mobile */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: "var(--color-gold)",
                        opacity: 0.3,
                        transform: "translateX(-50%)",
                        display: "none",
                    }}
                    className="timeline-line"
                />

                {events.map((event, index) => (
                    <motion.div
                        key={event.year}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: index * 0.08 }}
                        style={{
                            display: "flex",
                            gap: "1.25rem",
                            alignItems: "flex-start",
                            marginBottom: "2rem",
                        }}
                    >
                        {/* Icon Column */}
                        <div
                            style={{
                                flexShrink: 0,
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-cream-dark)",
                                border: "1px solid var(--color-gold)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.85rem",
                                color: "var(--color-gold)",
                                marginTop: "0.25rem",
                            }}
                        >
                            {event.icon}
                        </div>

                        {/* Card */}
                        <div
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                padding: "1.5rem",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                                borderTop: "2px solid var(--color-gold)",
                            }}
                        >
                            {/* Year */}
                            <span
                                style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.25em",
                                    textTransform: "uppercase",
                                    color: "var(--color-gold)",
                                    display: "block",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                {event.year}
                            </span>

                            {/* Title */}
                            <h3
                                style={{
                                    fontFamily: "var(--font-serif)",
                                    fontSize: "1.2rem",
                                    color: "var(--color-charcoal)",
                                    marginBottom: "0.6rem",
                                }}
                            >
                                {event.title}
                            </h3>

                            {/* Description */}
                            <p
                                style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.875rem",
                                    color: "rgba(31,31,31,0.65)",
                                    lineHeight: 1.8,
                                }}
                            >
                                {event.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}