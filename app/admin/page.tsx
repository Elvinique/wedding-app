"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface RSVP {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  attendance: string;
  guest_count: number;
  dietary: string | null;
  qr_verified: boolean;
  created_at: string;
}

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

interface Stats {
  total: number;
  attending: number;
  declining: number;
  totalGuests: number;
  verified: number;
}

const ADMIN_PASSWORD = "faithjoe2026admin";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    attending: 0,
    declining: 0,
    totalGuests: 0,
    verified: 0,
  });
  const [activeTab, setActiveTab] = useState<"rsvps" | "guestbook">("rsvps");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rsvpRes, guestbookRes] = await Promise.all([
          api.get("/api/admin/rsvps"),
          api.get("/api/guestbook?limit=100"),
        ]);

        const rsvpData: RSVP[] = rsvpRes.data.rsvps || [];
        setRsvps(rsvpData);
        setMessages(guestbookRes.data.messages || []);

        setStats({
          total: rsvpData.length,
          attending: rsvpData.filter((r) => r.attendance === "yes").length,
          declining: rsvpData.filter((r) => r.attendance === "no").length,
          totalGuests: rsvpData
            .filter((r) => r.attendance === "yes")
            .reduce((sum, r) => sum + r.guest_count, 0),
          verified: rsvpData.filter((r) => r.qr_verified).length,
        });
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const filteredRsvps = rsvps.filter(
    (r) =>
      r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-charcoal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(198,166,100,0.2)",
            padding: "3rem 2.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "0.75rem",
            }}
          >
            Admin Access
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Dashboard
          </h1>
          <div
            style={{
              width: "48px",
              height: "1px",
              backgroundColor: "var(--color-gold)",
              margin: "1rem auto 2rem",
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            style={{ ...inputStyle, marginBottom: "1rem" }}
          />

          {passwordError && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "#FF3860",
                marginBottom: "1rem",
              }}
            >
              {passwordError}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "var(--color-gold)",
              color: "white",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}
          >
            Enter Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  // Dashboard
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-cream)",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "0.5rem",
            }}
          >
            Faith & Joe's Wedding
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.5rem",
              color: "var(--color-charcoal)",
            }}
          >
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Total RSVPs", value: stats.total, icon: "◈" },
            { label: "Attending", value: stats.attending, icon: "✓" },
            { label: "Declining", value: stats.declining, icon: "✕" },
            { label: "Total Guests", value: stats.totalGuests, icon: "♡" },
            { label: "Checked In", value: stats.verified, icon: "◉" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                borderTop: "2px solid var(--color-gold)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  color: "var(--color-gold)",
                  marginBottom: "0.5rem",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  color: "var(--color-charcoal)",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(31,31,31,0.5)",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0",
            marginBottom: "2rem",
            borderBottom: "1px solid rgba(198,166,100,0.2)",
          }}
        >
          {(["rsvps", "guestbook"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.85rem 1.75rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                backgroundColor: "transparent",
                color:
                  activeTab === tab
                    ? "var(--color-gold)"
                    : "rgba(31,31,31,0.4)",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--color-gold)"
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab === "rsvps" ? "RSVPs" : "Guestbook"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                color: "rgba(31,31,31,0.4)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize: "0.8rem",
              }}
            >
              Loading...
            </p>
          </div>
        ) : (
          <>
            {/* RSVPs Tab */}
            {activeTab === "rsvps" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Search */}
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  style={{
                    ...inputStyle,
                    marginBottom: "1.5rem",
                    maxWidth: "400px",
                  }}
                />

                {/* RSVP List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {filteredRsvps.length === 0 ? (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        color: "rgba(31,31,31,0.4)",
                        textAlign: "center",
                        padding: "3rem",
                      }}
                    >
                      No RSVPs found.
                    </p>
                  ) : (
                    filteredRsvps.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        style={{
                          backgroundColor: "white",
                          padding: "1.25rem 1.5rem",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                          borderLeft: `3px solid ${
                            rsvp.attendance === "yes"
                              ? "var(--color-gold)"
                              : "rgba(31,31,31,0.2)"
                          }`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "1rem",
                              color: "var(--color-charcoal)",
                              marginBottom: "0.2rem",
                            }}
                          >
                            {rsvp.full_name}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.8rem",
                              color: "rgba(31,31,31,0.5)",
                            }}
                          >
                            {rsvp.email} · {rsvp.phone}
                          </p>
                          {rsvp.dietary && (
                            <p
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.75rem",
                                color: "var(--color-gold)",
                                marginTop: "0.2rem",
                              }}
                            >
                              Dietary: {rsvp.dietary}
                            </p>
                          )}
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
                            <span
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.65rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "2px",
                                backgroundColor:
                                  rsvp.attendance === "yes"
                                    ? "rgba(72,199,142,0.15)"
                                    : "rgba(255,56,96,0.1)",
                                color:
                                  rsvp.attendance === "yes"
                                    ? "#48C78E"
                                    : "#FF3860",
                              }}
                            >
                              {rsvp.attendance === "yes"
                                ? "Attending"
                                : "Declined"}
                            </span>
                            {rsvp.qr_verified && (
                              <span
                                style={{
                                  fontFamily: "var(--font-sans)",
                                  fontSize: "0.65rem",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "2px",
                                  backgroundColor: "rgba(32,156,238,0.15)",
                                  color: "#209CEE",
                                }}
                              >
                                Checked In
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.75rem",
                              color: "rgba(31,31,31,0.4)",
                            }}
                          >
                            {rsvp.attendance === "yes"
                              ? `${rsvp.guest_count} guest${rsvp.guest_count > 1 ? "s" : ""}`
                              : "—"}{" "}
                            · {formatDate(rsvp.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Guestbook Tab */}
            {activeTab === "guestbook" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {messages.length === 0 ? (
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "rgba(31,31,31,0.4)",
                      textAlign: "center",
                      padding: "3rem",
                    }}
                  >
                    No messages yet.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        backgroundColor: "white",
                        padding: "1.25rem 1.5rem",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        borderLeft: "3px solid var(--color-gold)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1rem",
                            color: "var(--color-charcoal)",
                          }}
                        >
                          {msg.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.72rem",
                            color: "rgba(31,31,31,0.4)",
                          }}
                        >
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          color: "rgba(31,31,31,0.65)",
                          lineHeight: 1.7,
                        }}
                      >
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}