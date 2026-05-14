"use client";

import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface GuestMessage {
    id: string;
    name: string;
    message: string;
    timestamp: Date;
}

const initialMessages: GuestMessage[] = [
    {
        id: "1",
        name: "Aunty Ngozi",
        message: "Wishing you both a lifetime of love, laughter, and happiness. God bless this union!",
        timestamp: new Date("2026-05-01"),
    },
    {
        id: "2",
        name: "Tunde & Bimpe",
        message: "So happy for you both! May your home be filled with joy and peace always.",
        timestamp: new Date("2026-05-03"),
    },
    {
        id: "3",
        name: "Uncle Chidi",
        message: "Two wonderful people coming together. This is truly a blessed day for both families.",
        timestamp: new Date("2026-05-05"),
    },
];

export default function Guestbook() {
    const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get("/api/guestbook");
                const raw = response.data.messages;
                if (raw && raw.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mapped = raw.map((m: any) => ({
                        id: String(m.id),
                        name: String(m.name),
                        message: String(m.message),
                        timestamp: m.created_at ? new Date(String(m.created_at)) : new Date(),
                    }));
                    setMessages(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        };
        fetchMessages();
    }, []);

    const MAX_CHARS = 200;

    const handleSubmit = async () => {
        setError("");

        if (name.trim().length < 2) {
            setError("Please enter your name.");
            return;
        }
        if (message.trim().length < 5) {
            setError("Please write a short message.");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/api/guestbook", {
                name: name.trim(),
                message: message.trim(),
            });
        } catch (error) {
            setError("Failed to post message. Please try again.");
            setIsSubmitting(false);
            return;
        }
        const newMessage: GuestMessage = {
            id: Date.now().toString(),
            name: name.trim(),
            message: message.trim(),
            timestamp: new Date(),
        };

        // Optimistic update — add to top of list instantly
        setMessages((prev) => [newMessage, ...prev]);
        setName("");
        setMessage("");
        setIsSubmitting(false);
        setSubmitted(true);

        setTimeout(() => setSubmitted(false), 3000);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const inputStyle = {
        width: "100%",
        padding: "0.85rem 1rem",
        fontFamily: "var(--font-sans)",
        fontSize: "0.9rem",
        color: "var(--color-charcoal)",
        backgroundColor: "var(--color-cream)",
        border: "1px solid rgba(198,166,100,0.3)",
        outline: "none",
        boxSizing: "border-box" as const,
    };

    return (
        <section
            id="guestbook"
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
                    Leave Your Wishes
                </motion.p>
                <motion.h2
                    className="section-title"
                    style={{ marginTop: "0.75rem" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    Guestbook
                </motion.h2>
                <motion.div
                    className="gold-divider"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
            </div>

            <div
                style={{
                    maxWidth: "640px",
                    margin: "0 auto",
                }}
            >
                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        backgroundColor: "white",
                        padding: "2.5rem",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                        marginBottom: "3rem",
                    }}
                >
                    <h3
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.3rem",
                            color: "var(--color-charcoal)",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Write a message
                    </h3>

                    {/* Name Input */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.75rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--color-charcoal)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Your Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Amaka Obi"
                            style={inputStyle}
                        />
                    </div>

                    {/* Message Input */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.75rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--color-charcoal)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Your Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_CHARS) {
                                    setMessage(e.target.value);
                                }
                            }}
                            placeholder="Write your wishes for the couple..."
                            rows={4}
                            style={{ ...inputStyle, resize: "none" }}
                        />
                        <p
                            style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.75rem",
                                color:
                                    message.length >= MAX_CHARS
                                        ? "#e53e3e"
                                        : "rgba(31,31,31,0.4)",
                                textAlign: "right",
                                marginTop: "0.35rem",
                            }}
                        >
                            {message.length}/{MAX_CHARS}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.8rem",
                                color: "#e53e3e",
                                marginBottom: "1rem",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-gold"
                        style={{
                            width: "100%",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.7 : 1,
                            textAlign: "center",
                            border: "none",
                            padding: "1rem",
                        }}
                    >
                        {isSubmitting ? "Posting..." : "Post Message"}
                    </button>

                    {/* Success Flash */}
                    <AnimatePresence>
                        {submitted && (
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.85rem",
                                    color: "var(--color-gold)",
                                    textAlign: "center",
                                    marginTop: "1rem",
                                }}
                            >
                                Your message has been posted!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Messages List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    backgroundColor: "white",
                                    padding: "1.75rem",
                                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                                    borderLeft: "3px solid var(--color-gold)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "0.75rem",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontFamily: "var(--font-serif)",
                                            fontSize: "1.1rem",
                                            color: "var(--color-charcoal)",
                                        }}
                                    >
                                        {msg.name}
                                    </h4>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-sans)",
                                            fontSize: "0.72rem",
                                            color: "rgba(31,31,31,0.4)",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {formatDate(msg.timestamp)}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "0.9rem",
                                        color: "rgba(31,31,31,0.7)",
                                        lineHeight: 1.75,
                                    }}
                                >
                                    {msg.message}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}