"use client";

import { motion } from "framer-motion";

interface LogisticsItem {
  icon: string;
  title: string;
  lines: string[];
  swatches?: { color: string; label: string }[];
}

const logistics: LogisticsItem[] = [
  {
    icon: "◈",
    title: "Dress Code",
    lines: [
      "Ladies: Ankara or lace in gold tones",
      "Gentlemen: Agbada or suit in navy or charcoal",
      "Smart elegant — no casual wear",
    ],
    swatches: [
  { color: "#98D8C8", label: "Mint Green" },
  { color: "#CC5500", label: "Burnt Orange" },
  { color: "#6F4E37", label: "Coffee Brown" },
  { color: "#FFFFFF", label: "White" },
],
  },
  {
    icon: "◷",
    title: "Event Schedule",
    lines: [
      "9:00 AM — Church Wedding",
      "12:00 PM — Guest Arrival",
      "1:00 PM — Reception Opens",
      "5:00 PM — End of Event",
    ],
  },
  {
    icon: "◎",
    title: "Accommodation",
    lines: [
      "Daffodil Hotel — on-site",
      "Quote 'Faith & Joe Wedding' for group rates",
    ],
  },
  {
    icon: "◉",
    title: "Transportation",
    lines: [
      "Parking available on-site",
      "Uber & Bolt recommended",
      "Airport pickup available on request",
    ],
  },
  {
    icon: "◐",
    title: "For Enquiry",
    lines: [
      "Contact: +234 8066099976",
      "+234 9039392341",
      "+234 7019082251",
    ],
  },
  {
    icon: "◑",
    title: "Special Notes",
    lines: [
      "Children are allowed at the reception",
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

            {/* Color Swatches */}
            {item.swatches && (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {item.swatches.map((swatch) => (
                  <div
                    key={swatch.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        backgroundColor: swatch.color,
                        border: "2px solid rgba(198,166,100,0.3)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(31,31,31,0.5)",
                      }}
                    >
                      {swatch.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

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