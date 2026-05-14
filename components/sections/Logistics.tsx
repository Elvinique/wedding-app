"use client";

import { motion } from "framer-motion";

const logistics = [
    {
        icon: "◈",
        title: "Dress Code",
        lines: [
            "Aso-Ebi: Gold & Champagne",
            "Ladies: Ankara or lace in gold tones",
            "Gentlemen: Agbada or suit in navy or charcoal",
            "Smart elegant — no casual wear",
        ],
    },
    {
        icon: "◷",
        title: "Event Schedule",
        lines: [
            "12:00 PM — Guest Arrival",
            "2:00 PM — Ceremony Begins",
            "4:30 PM — Cocktail Hour",
            "5:00 PM — Reception Opens",
            "10:00 PM — End of Event",
        ],
    },
    {
        icon: "◎",
        title: "Accommodation",
        lines: [
            "Eko Hotel & Suites — on-site",
            "Radisson Blu — 5 mins away",
            "Federal Palace Hotel — 10 mins away",
            "Quote 'Faith & Joe Wedding' for group rates",
        ],
    },
    {
        icon: "◉",
        title: "Transportation",
        lines: [
            "Shuttle from Eko Hotel every 30 mins",
            "Parking available on-site",
            "Uber & Bolt recommended",
            "Airport pickup available on request",
        ],
    },
    {
        icon: "◐",
        title: "Aso-Ebi Pickup",
        lines: [
            "Contact: +234 801 234 5678",
            "Pickup location: Victoria Island",
            "Available from: October 1st",
            "Payment via transfer only",
        ],
    },
    {
        icon: "◑",
        title: "Special Notes",
        lines: [
            "Children welcome at the reception",
            "Dietary needs — indicate on RSVP",
            "Photography allowed during reception",
            "Gift registry available below",
        ],
    },
];

export default function Logistics() {
    return (
        <section
            id="logistics"
            style={{
                backgroundColor: "var(--color-cream)",
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
                    Everything You Need to Know
                </motion.p>
                <motion.h2
                    className="section-title"
                    style={{ marginTop: "0.75rem" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    Aso-Ebi & Logistics
                </motion.h2>
                <motion.div
                    className="gold-divider"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
            </div>

            {/* Cards Grid */}
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {logistics.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: index * 0.08 }}
                        style={{
                            backgroundColor: "white",
                            padding: "2rem",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                            borderBottom: "2px solid var(--color-gold)",
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--color-gold)",
                                marginBottom: "1rem",
                            }}
                        >
                            {item.icon}
                        </div>

                        {/* Title */}
                        <h3
                            style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "1.2rem",
                                color: "var(--color-charcoal)",
                                marginBottom: "1rem",
                            }}
                        >
                            {item.title}
                        </h3>

                        {/* Lines */}
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {item.lines.map((line) => (
                                <li
                                    key={line}
                                    style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "0.85rem",
                                        color: "rgba(31,31,31,0.65)",
                                        lineHeight: 1.7,
                                        paddingBottom: "0.25rem",
                                        borderBottom: "1px solid rgba(198,166,100,0.15)",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}