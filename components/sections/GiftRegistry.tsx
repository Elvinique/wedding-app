"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const bankAccounts = [
    {
        bank: "First Bank Nigeria",
        accountName: "Faith Dumpe",
        accountNumber: "3012345678",
    },
    {
        bank: "ECOBank",
        accountName: "Joseph Dumpe",
        accountNumber: "5481086209",
    },
];

const giftSuggestions = [
    { amount: "NGN 10,000", label: "Honeymoon Dinner" },
    { amount: "NGN 25,000", label: "Hotel Night" },
    { amount: "NGN 50,000", label: "Weekend Getaway" },
    { amount: "NGN 100,000", label: "Honeymoon Experience" },
];

export default function GiftRegistry() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <section
            id="gifts"
            style={{
                backgroundColor: "var(--color-charcoal)",
                padding: "6rem 1.5rem",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    With Love & Gratitude
                </motion.p>
                <motion.h2
                    className="section-title"
                    style={{ marginTop: "0.75rem", color: "white" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    Gift Registry
                </motion.h2>
                <motion.div
                    className="gold-divider"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.95rem",
                        color: "rgba(247,242,234,0.6)",
                        maxWidth: "480px",
                        margin: "0 auto",
                        lineHeight: 1.8,
                    }}
                >
                    Your presence is the greatest gift. However, if you wish to bless us,
                    we are grateful for contributions toward our new journey together.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                    maxWidth: "700px",
                    margin: "0 auto 3.5rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                }}
            >
                {giftSuggestions.map((gift) => (
                    <div
                        key={gift.label}
                        style={{
                            border: "1px solid rgba(198,166,100,0.3)",
                            padding: "1.25rem",
                            textAlign: "center",
                            transition: "border-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-gold)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(198,166,100,0.3)";
                        }}
                    >
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-gold)", marginBottom: "0.35rem" }}>
                            {gift.amount}
                        </p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(247,242,234,0.5)" }}>
                            {gift.label}
                        </p>
                    </div>
                ))}
            </motion.div>

            <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {bankAccounts.map((account, index) => (
                    <motion.div
                        key={account.bank}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(198,166,100,0.2)",
                            padding: "1.75rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                        }}
                    >
                        <div>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "0.4rem" }}>
                                {account.bank}
                            </p>
                            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "white", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                                {account.accountNumber}
                            </p>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "rgba(247,242,234,0.5)" }}>
                                {account.accountName}
                            </p>
                        </div>

                        <button
                            onClick={() => copyToClipboard(account.accountNumber, index)}
                            style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: copiedIndex === index ? "var(--color-gold)" : "rgba(247,242,234,0.5)",
                                backgroundColor: "transparent",
                                border: copiedIndex === index ? "1px solid var(--color-gold)" : "1px solid rgba(247,242,234,0.2)",
                                padding: "0.6rem 1.25rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {copiedIndex === index ? "Copied!" : "Copy Number"}
                        </button>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "rgba(247,242,234,0.3)",
                    textAlign: "center",
                    marginTop: "3rem",
                    letterSpacing: "0.1em",
                }}
            >
                Transfers can be made before or on the day of the wedding.
            </motion.p>
        </section>
    );
}