"use client";

import { motion } from "framer-motion";

const events = [
    {
        year: "2020",
        title: "First Meeting",
        description:
            "Two souls crossed paths at a mutual friend's gathering in Lagos. A glance, a smile, and the rest was destiny.",
        icon: "✦",
    },
    {
        year: "2021",
        title: "First Date",
        description:
            "A quiet dinner at a rooftop restaurant overlooking the Lagos skyline. They talked until the city lights went dim.",
        icon: "♡",
    },
    {
        year: "2022",
        title: "The Proposal",
        description:
            "Under a canopy of stars on the Lekki waterfront, he got down on one knee. She said yes before he finished the sentence.",
        icon: "◇",
    },
    {
        year: "2023",
        title: "Engagement",
        description:
            "Surrounded by family and friends, they celebrated their love the Nigerian way — with music, food, and plenty of dancing.",
        icon: "❋",
    },
    {
        year: "2026",
        title: "The Wedding",
        description:
            "Today, they begin forever. Thank you for being part of this moment.",
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
                    maxWidth: "700px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Vertical Line */}
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
                    }}
                />

                {events.map((event, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <motion.div
                            key={event.year}
                            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{
                                display: "flex",
                                justifyContent: isLeft ? "flex-start" : "flex-end",
                                paddingBottom: "3rem",
                                position: "relative",
                            }}
                        >
                            {/* Card */}
                            <div
                                style={{
                                    width: "calc(50% - 2rem)",
                                    backgroundColor: "white",
                                    padding: "1.5rem",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                                    borderTop: "2px solid var(--color-gold)",
                                    position: "relative",
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
                                        fontSize: "1.25rem",
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
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {event.description}
                                </p>
                            </div>

                            {/* Center Icon */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "1.5rem",
                                    transform: "translateX(-50%)",
                                    width: "2.25rem",
                                    height: "2.25rem",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--color-cream)",
                                    border: "1px solid var(--color-gold)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    color: "var(--color-gold)",
                                    zIndex: 1,
                                }}
                            >
                                {event.icon}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}