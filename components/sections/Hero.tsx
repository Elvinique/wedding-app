"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { weddingConfig } from "@/lib/wedding.config";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: "easeOut" as const, delay },
    }),
};

function CountdownBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span
                style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.8rem, 6vw, 3rem)",
                    color: "var(--color-gold)",
                    lineHeight: 1,
                }}
            >
                {String(value).padStart(2, "0")}
            </span>
            <span
                style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(247,242,234,0.6)",
                    marginTop: "0.4rem",
                }}
            >
                {label}
            </span>
        </div>
    );
}

export default function Hero() {
    const { bride, groom } = weddingConfig.couple;
    const { days, hours, minutes, seconds } = useCountdown(weddingConfig.date);

    const weddingDateFormatted = weddingConfig.date.toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section
            style={{
                position: "relative",
                minHeight: "100svh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {/* Background Image */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url('/images/hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                }}
            />

            {/* Dark Gradient Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                    padding: "2rem 1.5rem",
                    width: "100%",
                    maxWidth: "700px",
                    margin: "0 auto",
                }}
            >
                {/* Subtitle */}
                <motion.p
                    className="section-subtitle"
                    style={{ color: "var(--color-gold)", marginBottom: "1.25rem" }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.1}
                >
                    Together with their families
                </motion.p>

                {/* Names */}
                <motion.h1
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
                        color: "white",
                        lineHeight: 1.1,
                        marginBottom: "0.5rem",
                    }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.3}
                >
                    {bride}
                    <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>
                        {" "}
                        &{" "}
                    </span>
                    {groom}
                </motion.h1>

                {/* Divider */}
                <motion.div
                    className="gold-divider"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.5}
                />

                {/* Date */}
                <motion.p
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.85rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(247,242,234,0.85)",
                        marginBottom: "2.5rem",
                    }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.6}
                >
                    {weddingDateFormatted}
                </motion.p>

                {/* Countdown */}
                <motion.div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "clamp(1.5rem, 5vw, 3rem)",
                        marginBottom: "3rem",
                    }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.8}
                >
                    <CountdownBox value={days} label="Days" />
                    <CountdownBox value={hours} label="Hours" />
                    <CountdownBox value={minutes} label="Mins" />
                    <CountdownBox value={seconds} label="Secs" />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                    }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                >
                    <a href="#rsvp" className="btn-gold" style={{ minWidth: "200px" }}>
                        RSVP Now
                    </a>

                    <a href="#details" className="btn-outline" style={{ minWidth: "200px", color: "white", borderColor: "rgba(247,242,234,0.5)" }}>
                        View Details
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(247,242,234,0.5)",
                    }}
                >
                    Scroll
                </span>
                <div
                    style={{
                        width: "1px",
                        height: "2rem",
                        background:
                            "linear-gradient(to bottom, rgba(198,166,100,0.8), transparent)",
                    }}
                />
            </motion.div>
        </section >
    );
}