"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  position: number;
}

const fallbackEvents: TimelineEvent[] = [
  {
    id: "1",
    year: "2014",
    title: "First Crossing of Paths",
    description: "Their story began long before either of them could have imagined. They first crossed paths in 2014 — not as close friends, but there was something about her that stayed with him.",
    icon: "✦",
    position: 0,
  },
  {
    id: "2",
    year: "2014 — 2025",
    title: "Different Directions",
    description: "As the years passed, life took them in different directions. The feeling never disappeared — it lingered quietly, a distant hope he held onto without knowing if it would ever amount to anything more.",
    icon: "◇",
    position: 1,
  },
  {
    id: "3",
    year: "December 2025",
    title: "Fate Brought Them Back",
    description: "Then, years later, fate intervened. Their paths crossed again when they reconnected on Facebook. What started as a simple friend request quickly became something much more.",
    icon: "♡",
    position: 2,
  },
  {
    id: "4",
    year: "Early 2026",
    title: "Something Rare",
    description: "With every conversation and every memory created together, it became clear that what they had found was something rare. Through life's highs and lows, they learned to lean on each other.",
    icon: "❋",
    position: 3,
  },
  {
    id: "5",
    year: "28th December 2025",
    title: "He Asked, She Said Yes",
    description: "Grateful for every twist, turn, and unexpected moment that led them back to one another, he got down on one knee. Without hesitation, she said yes.",
    icon: "◈",
    position: 4,
  },
  {
    id: "6",
    year: "27th June 2026",
    title: "Our Forever Begins",
    description: "Today, they prepare to begin their next chapter together — building a home filled with laughter, creating lasting memories, and sharing a lifetime of adventures. My King, My Crown You are not just my husband, but my best friend, my peace, and my favorite person in the world. Loving you feels effortless. Cheers to forever with you. ❤️",
    icon: "♔",
    position: 5,
  },
];

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(fallbackEvents);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("timeline_events")
          .select("*")
          .order("position");

        if (!error && data && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
        {isLoading ? (
          // Skeleton loader
          [1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "2rem" }}>
              <div style={{ flexShrink: 0, width: "2.5rem", height: "2.5rem", borderRadius: "50%", backgroundColor: "var(--color-cream-dark)", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ flex: 1, backgroundColor: "white", padding: "1.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ width: "60px", height: "10px", backgroundColor: "var(--color-cream-dark)", borderRadius: "4px", marginBottom: "0.5rem", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ width: "140px", height: "16px", backgroundColor: "var(--color-cream-dark)", borderRadius: "4px", marginBottom: "0.75rem", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ width: "100%", height: "10px", backgroundColor: "var(--color-cream-dark)", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            </div>
          ))
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
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
              {/* Icon */}
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
          ))
        )}
      </div>
    </section>
  );
}