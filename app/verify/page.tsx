"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface GuestInfo {
  full_name: string;
  email: string;
  attendance: string;
  guest_count: number;
  qr_verified: boolean;
}

type ScanStatus = "idle" | "scanning" | "loading" | "success" | "error" | "already_used";

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [guest, setGuest] = useState<GuestInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanMode, setScanMode] = useState<"manual" | "camera">("manual");
  const scannerRef = useRef<unknown>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scanMode === "camera" && status === "idle") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [scanMode, status]);

  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!scannerDivRef.current) return;

      const scanner = new Html5Qrcode("qr-scanner-div");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText: string) => {
          stopScanner();
          verifyToken(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error("Camera error:", err);
      setScanMode("manual");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const scanner = scannerRef.current as {
          stop: () => Promise<void>;
          clear: () => void;
        };
        await scanner.stop();
        scanner.clear();
      } catch {}
      scannerRef.current = null;
    }
  };

  const verifyToken = async (rawToken: string) => {
    setStatus("loading");
    setGuest(null);
    setErrorMessage("");

    const extracted = rawToken.includes("WEDDING-VERIFY:")
      ? rawToken.replace("WEDDING-VERIFY:", "").trim()
      : rawToken.trim();

    try {
      const response = await api.get(`/api/rsvp/verify/${extracted}`);
      setGuest(response.data.guest);
      setStatus("success");
      setToken("");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response
              ?.data?.error || ""
          : "";

      if (message.toLowerCase().includes("already been used")) {
        setStatus("already_used");
      } else {
        setStatus("error");
        setErrorMessage(message || "Invalid QR code. Please try again.");
      }
    }
  };

  const handleManualVerify = () => {
    if (!token.trim()) return;
    verifyToken(token);
  };

  const handleReset = () => {
    setStatus("idle");
    setGuest(null);
    setToken("");
    setErrorMessage("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-charcoal)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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
          Staff Only
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            color: "white",
            marginBottom: "0.5rem",
          }}
        >
          Guest Verification
        </h1>
        <div
          style={{
            width: "48px",
            height: "1px",
            backgroundColor: "var(--color-gold)",
            margin: "1rem auto",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "rgba(247,242,234,0.5)",
          }}
        >
          Scan or enter the guest QR token to verify entry
        </p>
      </div>

      {/* Mode Toggle */}
      {(status === "idle" || status === "scanning") && (
        <div
          style={{
            display: "flex",
            gap: "0",
            marginBottom: "1.5rem",
            border: "1px solid rgba(198,166,100,0.3)",
          }}
        >
          {(["manual", "camera"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setScanMode(mode);
                setStatus("idle");
              }}
              style={{
                padding: "0.6rem 1.5rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                backgroundColor:
                  scanMode === mode
                    ? "var(--color-gold)"
                    : "transparent",
                color: scanMode === mode ? "white" : "rgba(247,242,234,0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {mode === "manual" ? "✎ Manual" : "⊙ Scan QR"}
            </button>
          ))}
        </div>
      )}

      {/* Scanner Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(198,166,100,0.2)",
          padding: "2.5rem",
        }}
      >
        <AnimatePresence mode="wait">

          {/* Camera Scanner */}
          {scanMode === "camera" && status === "idle" && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "rgba(247,242,234,0.5)",
                  textAlign: "center",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Point camera at guest QR code
              </p>
              <div
                id="qr-scanner-div"
                ref={scannerDivRef}
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid rgba(198,166,100,0.3)",
                }}
              />
            </motion.div>
          )}

          {/* Manual Input */}
          {scanMode === "manual" &&
            (status === "idle" || status === "loading") && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    marginBottom: "0.75rem",
                  }}
                >
                  QR Token
                </label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                  placeholder="Paste QR token here..."
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    color: "var(--color-charcoal)",
                    backgroundColor: "var(--color-cream)",
                    border: "1px solid rgba(198,166,100,0.3)",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: "1.25rem",
                  }}
                />
                <button
                  onClick={handleManualVerify}
                  disabled={status === "loading" || !token.trim()}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor:
                      status === "loading" || !token.trim()
                        ? "rgba(198,166,100,0.4)"
                        : "var(--color-gold)",
                    color: "white",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor:
                      status === "loading" || !token.trim()
                        ? "not-allowed"
                        : "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {status === "loading" ? "Verifying..." : "Verify Guest"}
                </button>
              </motion.div>
            )}

          {/* Loading for camera scan */}
          {status === "loading" && scanMode === "camera" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(247,242,234,0.5)",
                }}
              >
                Verifying...
              </p>
            </motion.div>
          )}

          {/* Success */}
          {status === "success" && guest && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(72,199,142,0.15)",
                  border: "2px solid #48C78E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.75rem",
                  color: "#48C78E",
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.6rem",
                  color: "white",
                  marginBottom: "0.5rem",
                }}
              >
                Welcome!
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.1rem",
                  color: "var(--color-gold)",
                  marginBottom: "1.5rem",
                  fontWeight: 500,
                }}
              >
                {guest.full_name}
              </p>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(247,242,234,0.4)",
                      display: "block",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Party Size
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      color: "white",
                    }}
                  >
                    {guest.guest_count}{" "}
                    {guest.guest_count === 1 ? "person" : "people"}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(247,242,234,0.4)",
                      display: "block",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Email
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.85rem",
                      color: "rgba(247,242,234,0.7)",
                    }}
                  >
                    {guest.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
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
                Scan Next Guest
              </button>
            </motion.div>
          )}

          {/* Already Used */}
          {status === "already_used" && (
            <motion.div
              key="already_used"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,183,0,0.15)",
                  border: "2px solid #FFB700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.75rem",
                }}
              >
                ⚠
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  color: "white",
                  marginBottom: "0.75rem",
                }}
              >
                Already Checked In
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  color: "rgba(247,242,234,0.6)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                This QR code has already been used for entry. Please check
                with a supervisor if you believe this is an error.
              </p>
              <button
                onClick={handleReset}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "transparent",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border: "1px solid var(--color-gold)",
                  cursor: "pointer",
                }}
              >
                Try Another
              </button>
            </motion.div>
          )}

          {/* Error */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,56,96,0.15)",
                  border: "2px solid #FF3860",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.75rem",
                  color: "#FF3860",
                }}
              >
                ✕
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  color: "white",
                  marginBottom: "0.75rem",
                }}
              >
                Invalid QR Code
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  color: "rgba(247,242,234,0.6)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                {errorMessage}
              </p>
              <button
                onClick={handleReset}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "transparent",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border: "1px solid var(--color-gold)",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.7rem",
          color: "rgba(247,242,234,0.2)",
          marginTop: "2rem",
          letterSpacing: "0.1em",
        }}
      >
        Faith & Joe's Wedding — Door Staff Only
      </p>
    </main>
  );
}