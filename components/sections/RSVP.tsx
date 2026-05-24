"use client";

import axios from "axios";
import { api } from "@/lib/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { weddingConfig } from "@/lib/wedding.config";

const rsvpSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  attendance: z.enum(["yes", "no"], {
    error: "Please select your attendance",
  }),
  guestCount: z
    .number({ error: "Please enter a number" })
    .min(1)
    .max(5),
  dietary: z.string().optional(),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

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
  transition: "border-color 0.2s ease",
};

const handleFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
};

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
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
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "#e53e3e",
            marginTop: "0.35rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState<string>("");
  const { bride, groom } = weddingConfig.couple;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guestCount: 1 },
  });

  const attendance = watch("attendance");

  const onSubmit = async (data: RsvpFormData) => {
    setError("");
    try {
      const response = await api.post("/api/rsvp", {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        attendance: data.attendance,
        guest_count: data.guestCount,
        dietary: data.dietary || null,
      });
      setSubmittedName(data.fullName.split(" ")[0]);
      setQrCode(response.data.qr_code);
      setSubmitted(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || "";
        if (message.toLowerCase().includes("already exists")) {
          setError(
            "You have already RSVP'd! Please check your email for your QR code entry pass."
          );
        } else {
          setError(message || "Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section
      id="rsvp"
      style={{
        backgroundColor: "var(--color-cream-dark)",
        padding: "6rem 1.5rem",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Kindly Reply By June 1st
        </motion.p>
        <motion.h2
          className="section-title"
          style={{ marginTop: "0.75rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          RSVP
        </motion.h2>
        <motion.div
          className="gold-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "2.5rem",
              boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputField label="Full Name" error={errors.fullName?.message}>
                <input
                  {...register("fullName")}
                  placeholder="e.g. Barile James"
                  style={inputStyle}
                  onFocus={handleFocus}
                />
              </InputField>

              <InputField label="Email Address" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="e.g. barile@email.com"
                  style={inputStyle}
                  onFocus={handleFocus}
                />
              </InputField>

              <InputField label="Phone Number" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="e.g. +234 801 234 5678"
                  style={inputStyle}
                  onFocus={handleFocus}
                />
              </InputField>

              <InputField
                label="Will you be attending?"
                error={errors.attendance?.message}
              >
                <select
                  {...register("attendance")}
                  style={inputStyle}
                  onFocus={handleFocus}
                >
                  <option value="">— Select —</option>
                  <option value="yes">Joyfully accepts</option>
                  <option value="no">Regretfully declines</option>
                </select>
              </InputField>

              {attendance === "yes" && (
                <>
                  <InputField
                    label="Number of Guests"
                    error={errors.guestCount?.message}
                  >
                    <input
                      {...register("guestCount", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={5}
                      style={inputStyle}
                      onFocus={handleFocus}
                    />
                  </InputField>

                  <InputField
                    label="Dietary Restrictions (optional)"
                    error={errors.dietary?.message}
                  >
                    <textarea
                      {...register("dietary")}
                      placeholder="e.g. Vegetarian, no nuts, halal..."
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={handleFocus}
                    />
                  </InputField>
                </>
              )}

              {/* Error Message */}
              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    color: "#e53e3e",
                    marginBottom: "1rem",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
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
                {isSubmitting ? "Sending..." : "Confirm Attendance"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "3.5rem 2.5rem",
              boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                color: "var(--color-gold)",
                marginBottom: "1.25rem",
              }}
            >
              ♡
            </div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.8rem",
                color: "var(--color-charcoal)",
                marginBottom: "1rem",
              }}
            >
              Thank you, {submittedName}!
            </h3>
            <div className="gold-divider" />
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "rgba(31,31,31,0.65)",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Your RSVP has been received. We are so excited to celebrate with
              you as {bride} & {groom} begin their forever.
            </p>

            {/* QR Code */}
            {qrCode && (
              <div style={{ marginBottom: "2rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    marginBottom: "1rem",
                  }}
                >
                  Your Entry QR Code
                </p>
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="Your QR Code"
                  style={{
                    width: "180px",
                    height: "180px",
                    margin: "0 auto",
                    display: "block",
                    border: "4px solid var(--color-cream-dark)",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "rgba(31,31,31,0.4)",
                    marginTop: "0.75rem",
                  }}
                >
                  Screenshot this code — show it at the entrance
                </p>
              </div>
            )}

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              {weddingConfig.couple.hashtag}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}