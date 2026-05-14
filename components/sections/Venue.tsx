"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding.config";

function VenueCard({
    type,
    name,
    address,
    time,
    mapsUrl,
    delay,
}: {
    type: string;
    name: string;
    address: string;
    time: string;
    mapsUrl: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay }}
            style={{
                flex: "1 1 300px",
                backgroundColor: "white",
                boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
                overflow: "hidden",
            }}
        >
            {/* Map Embed */}
            <div style={{ position: "relative", height: "220px", backgroundColor: "var(--color-cream-dark)" }}>
                <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {/* Card Content */}
            <div style={{ padding: "1.75rem" }}>
                <span
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--color-gold)",
                        display: "block",
                        marginBottom: "0.5rem",
                    }}
                >
                    {type}
                </span>

                <h3
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.4rem",
                        color: "var(--color-charcoal)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3,
                    }}
                >
                    {name}
                </h3>

                <p
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        color: "rgba(31,31,31,0.6)",
                        marginBottom: "0.4rem",
                        lineHeight: 1.6,
                    }}
                >
                    {address}
                </p>

                <p
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8rem",
                        color: "var(--color-gold)",
                        letterSpacing: "0.1em",
                        marginBottom: "1.5rem",
                    }}
                >
                    {time}
                </p>


                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ display: "inline-block", fontSize: "0.75rem" }}>
                    Get Directions
                </a>
            </div>
        </motion.div >
    );
}

export default function Venue() {
    return (
        <section
            id="details"
            style={{
                backgroundColor: "var(--color-cream-dark)",
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
                    Where & When
                </motion.p>
                <motion.h2
                    className="section-title"
                    style={{ marginTop: "0.75rem" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    The Venues
                </motion.h2>
                <motion.div
                    className="gold-divider"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
            </div>

            {/* Venue Cards */}
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    justifyContent: "center",
                }}
            >
                <VenueCard
                    type="Ceremony"
                    name={weddingConfig.ceremony.name}
                    address={weddingConfig.ceremony.address}
                    time={weddingConfig.ceremony.time}
                    mapsUrl={weddingConfig.ceremony.mapsUrl}
                    delay={0.1}
                />
                <VenueCard
                    type="Reception"
                    name={weddingConfig.reception.name}
                    address={weddingConfig.reception.address}
                    time={weddingConfig.reception.time}
                    mapsUrl={weddingConfig.reception.mapsUrl}
                    delay={0.3}
                />
            </div>
        </section>
    );
}