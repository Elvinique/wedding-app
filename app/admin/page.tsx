"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

const ADMIN_PASSWORD = "faithjoe2026admin";

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

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  position: number;
}

interface WeddingContent {
  [key: string]: string;
}

interface Stats {
  total: number;
  attending: number;
  declining: number;
  totalGuests: number;
  verified: number;
}

type Tab = "overview" | "gallery" | "timeline" | "details" | "guestbook";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, attending: 0, declining: 0, totalGuests: 0, verified: 0 });
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; caption: string }[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [content, setContent] = useState<WeddingContent>({});
  const [searchTerm, setSearchTerm] = useState("");

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

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
    fetchAllData();
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [rsvpRes, guestbookRes, galleryRes, timelineRes, contentRes] = await Promise.all([
        api.get("/api/admin/rsvps"),
        api.get("/api/guestbook?limit=100"),
        supabase.from("gallery_images").select("*").order("position"),
        supabase.from("timeline_events").select("*").order("position"),
        supabase.from("wedding_content").select("*"),
      ]);

      const rsvpData: RSVP[] = rsvpRes.data.rsvps || [];
      setRsvps(rsvpData);
      setMessages(guestbookRes.data.messages || []);

      setStats({
        total: rsvpData.length,
        attending: rsvpData.filter((r) => r.attendance === "yes").length,
        declining: rsvpData.filter((r) => r.attendance === "no").length,
        totalGuests: rsvpData.filter((r) => r.attendance === "yes").reduce((sum, r) => sum + r.guest_count, 0),
        verified: rsvpData.filter((r) => r.qr_verified).length,
      });

      if (galleryRes.data) setGalleryImages(galleryRes.data);
      if (timelineRes.data) setTimelineEvents(timelineRes.data);
      if (contentRes.data) {
        const contentMap: WeddingContent = {};
        contentRes.data.forEach((item: { key: string; value: string }) => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `hero/hero-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("wedding-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("wedding-images").getPublicUrl(path);
      await supabase.from("wedding_content").upsert({ key: "hero_image_url", value: urlData.publicUrl });
      setContent((prev) => ({ ...prev, hero_image_url: urlData.publicUrl }));
      setSaveStatus("Hero image updated successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setSaveStatus("Upload failed. Please try again.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `gallery/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("wedding-images").upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("wedding-images").getPublicUrl(path);
        await supabase.from("gallery_images").insert({ url: urlData.publicUrl, caption: "", position: galleryImages.length });
      }
      const { data } = await supabase.from("gallery_images").select("*").order("position");
      if (data) setGalleryImages(data);
      setSaveStatus("Gallery images uploaded successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Gallery upload failed:", err);
      setSaveStatus("Upload failed. Please try again.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    await supabase.from("gallery_images").delete().eq("id", id);
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateCaption = async (id: string, caption: string) => {
    await supabase.from("gallery_images").update({ caption }).eq("id", id);
    setGalleryImages((prev) => prev.map((img) => img.id === id ? { ...img, caption } : img));
  };

  const handleSaveContent = async () => {
    setSaveStatus("Saving...");
    try {
      const updates = Object.entries(content).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
      await supabase.from("wedding_content").upsert(updates, { onConflict: "key" });
      setSaveStatus("Changes saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("Save failed. Please try again.");
    }
  };

  const handleSaveTimeline = async () => {
    setSaveStatus("Saving...");
    try {
      for (const event of timelineEvents) {
        await supabase.from("timeline_events").upsert(event, { onConflict: "id" });
      }
      setSaveStatus("Timeline saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("Save failed. Please try again.");
    }
  };

  const handleAddTimelineEvent = async () => {
    const newEvent = { year: "2026", title: "New Moment", description: "Describe this moment...", icon: "♡", position: timelineEvents.length };
    const { data } = await supabase.from("timeline_events").insert(newEvent).select().single();
    if (data) setTimelineEvents((prev) => [...prev, data]);
  };

  const handleDeleteTimelineEvent = async (id: string) => {
    await supabase.from("timeline_events").delete().eq("id", id);
    setTimelineEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredRsvps = rsvps.filter(
    (r) => r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    color: "var(--color-charcoal)",
    backgroundColor: "var(--color-cream)",
    border: "1px solid rgba(198,166,100,0.3)",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "2px",
  };

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: "0.75rem 1.25rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    backgroundColor: "transparent",
    color: activeTab === tab ? "var(--color-gold)" : "rgba(31,31,31,0.4)",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid var(--color-gold)" : "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  });

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: "var(--color-charcoal)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: "420px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,166,100,0.2)", padding: "3rem 2.5rem", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "0.75rem" }}>
            Admin Access
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "white", marginBottom: "0.5rem" }}>
            Dashboard
          </h1>
          <div style={{ width: "48px", height: "1px", backgroundColor: "var(--color-gold)", margin: "1rem auto 2rem" }} />

          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              style={{ ...inputStyle, paddingRight: "3rem", backgroundColor: "rgba(247,242,234,0.1)", color: "white", border: "1px solid rgba(198,166,100,0.3)" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(247,242,234,0.5)", fontSize: "1rem" }}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {passwordError && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#FF3860", marginBottom: "1rem" }}>
              {passwordError}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{ width: "100%", padding: "1rem", backgroundColor: "var(--color-gold)", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
          >
            Enter Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)", padding: "0" }}>

      {/* Top Bar */}
      <div style={{ backgroundColor: "var(--color-charcoal)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "0.2rem" }}>
            Admin Dashboard
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "white" }}>
            Faith & Joe&apos;s Wedding
          </h1>
        </div>
        <a href="/" target="_blank" style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-gold)", textDecoration: "none", border: "1px solid rgba(198,166,100,0.3)", padding: "0.5rem 1rem" }}>
          View Site ↗
        </a>
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ backgroundColor: saveStatus.includes("failed") ? "#FF3860" : "#48C78E", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.8rem", padding: "0.75rem 2rem", textAlign: "center", letterSpacing: "0.05em" }}
          >
            {saveStatus}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: "2.5rem", borderBottom: "1px solid rgba(198,166,100,0.2)", overflowX: "auto" }}>
          {(["overview", "gallery", "timeline", "details", "guestbook"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
              {tab === "overview" ? "📊 Overview" :
               tab === "gallery" ? "🖼 Gallery" :
               tab === "timeline" ? "💛 Love Story" :
               tab === "details" ? "✏️ Wedding Details" :
               "💬 Guestbook"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", color: "rgba(31,31,31,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
                  {[
                    { label: "Total RSVPs", value: stats.total, icon: "◈" },
                    { label: "Attending", value: stats.attending, icon: "✓" },
                    { label: "Declining", value: stats.declining, icon: "✕" },
                    { label: "Total Guests", value: stats.totalGuests, icon: "♡" },
                    { label: "Checked In", value: stats.verified, icon: "◉" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ backgroundColor: "white", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: "2px solid var(--color-gold)", textAlign: "center" }}>
                      <div style={{ fontSize: "1.25rem", color: "var(--color-gold)", marginBottom: "0.5rem" }}>{stat.icon}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--color-charcoal)", lineHeight: 1, marginBottom: "0.4rem" }}>{stat.value}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email..." style={{ ...inputStyle, marginBottom: "1.5rem", maxWidth: "400px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {filteredRsvps.map((rsvp) => (
                    <div key={rsvp.id} style={{ backgroundColor: "white", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: `3px solid ${rsvp.attendance === "yes" ? "var(--color-gold)" : "rgba(31,31,31,0.2)"}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--color-charcoal)", marginBottom: "0.2rem" }}>{rsvp.full_name}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(31,31,31,0.5)" }}>{rsvp.email} · {rsvp.phone}</p>
                        {rsvp.dietary && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-gold)", marginTop: "0.2rem" }}>Dietary: {rsvp.dietary}</p>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", backgroundColor: rsvp.attendance === "yes" ? "rgba(72,199,142,0.15)" : "rgba(255,56,96,0.1)", color: rsvp.attendance === "yes" ? "#48C78E" : "#FF3860" }}>
                            {rsvp.attendance === "yes" ? "Attending" : "Declined"}
                          </span>
                          {rsvp.qr_verified && <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", backgroundColor: "rgba(32,156,238,0.15)", color: "#209CEE" }}>Checked In</span>}
                        </div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(31,31,31,0.4)" }}>
                          {rsvp.attendance === "yes" ? `${rsvp.guest_count} guest${rsvp.guest_count > 1 ? "s" : ""}` : "—"} · {formatDate(rsvp.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-charcoal)", marginBottom: "2rem" }}>Manage Images</h2>

                <div style={{ backgroundColor: "white", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "2rem", borderTop: "2px solid var(--color-gold)" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--color-charcoal)", marginBottom: "1rem" }}>Hero Image</h3>
                  {content.hero_image_url && (
                    <img src={content.hero_image_url} alt="Hero" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginBottom: "1rem", display: "block" }} />
                  )}
                  <input ref={heroInputRef} type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: "none" }} />
                  <button onClick={() => heroInputRef.current?.click()} disabled={uploadingHero} style={{ padding: "0.75rem 1.5rem", backgroundColor: uploadingHero ? "rgba(198,166,100,0.4)" : "var(--color-gold)", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: uploadingHero ? "not-allowed" : "pointer" }}>
                    {uploadingHero ? "Uploading..." : "Upload New Hero Image"}
                  </button>
                </div>

                <div style={{ backgroundColor: "white", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: "2px solid var(--color-gold)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--color-charcoal)" }}>Gallery Images</h3>
                    <div>
                      <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} />
                      <button onClick={() => galleryInputRef.current?.click()} disabled={uploadingGallery} style={{ padding: "0.75rem 1.5rem", backgroundColor: uploadingGallery ? "rgba(198,166,100,0.4)" : "var(--color-gold)", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: uploadingGallery ? "not-allowed" : "pointer" }}>
                        {uploadingGallery ? "Uploading..." : "+ Add Images"}
                      </button>
                    </div>
                  </div>

                  {galleryImages.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(31,31,31,0.4)", textAlign: "center", padding: "2rem" }}>
                      No gallery images yet. Upload some!
                    </p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                      {galleryImages.map((img) => (
                        <div key={img.id} style={{ position: "relative", border: "1px solid rgba(198,166,100,0.2)" }}>
                          <img src={img.url} alt={img.caption} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
                          <div style={{ padding: "0.75rem" }}>
                            <input value={img.caption} onChange={(e) => handleUpdateCaption(img.id, e.target.value)} placeholder="Add caption..." style={{ ...inputStyle, fontSize: "0.8rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }} />
                            <button onClick={() => handleDeleteGalleryImage(img.id)} style={{ width: "100%", padding: "0.4rem", backgroundColor: "rgba(255,56,96,0.1)", color: "#FF3860", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,56,96,0.2)", cursor: "pointer" }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "timeline" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-charcoal)" }}>Love Story Timeline</h2>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={handleAddTimelineEvent} style={{ padding: "0.75rem 1.5rem", backgroundColor: "transparent", color: "var(--color-gold)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid var(--color-gold)", cursor: "pointer" }}>
                      + Add Event
                    </button>
                    <button onClick={handleSaveTimeline} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-gold)", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                      Save Changes
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {timelineEvents.map((event, index) => (
                    <div key={event.id} style={{ backgroundColor: "white", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderLeft: "3px solid var(--color-gold)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-gold)" }}>
                          Event {index + 1}
                        </span>
                        <button onClick={() => handleDeleteTimelineEvent(event.id)} style={{ background: "none", border: "none", color: "#FF3860", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-sans)" }}>
                          ✕ Delete
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)", marginBottom: "0.4rem" }}>Year / Period</label>
                          <input value={event.year} onChange={(e) => setTimelineEvents((prev) => prev.map((ev) => ev.id === event.id ? { ...ev, year: e.target.value } : ev))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)", marginBottom: "0.4rem" }}>Icon</label>
                          <input value={event.icon} onChange={(e) => setTimelineEvents((prev) => prev.map((ev) => ev.id === event.id ? { ...ev, icon: e.target.value } : ev))} style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)", marginBottom: "0.4rem" }}>Title</label>
                        <input value={event.title} onChange={(e) => setTimelineEvents((prev) => prev.map((ev) => ev.id === event.id ? { ...ev, title: e.target.value } : ev))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)", marginBottom: "0.4rem" }}>Description</label>
                        <textarea value={event.description} onChange={(e) => setTimelineEvents((prev) => prev.map((ev) => ev.id === event.id ? { ...ev, description: e.target.value } : ev))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                      </div>
                    </div>
                  ))}
                  {timelineEvents.length === 0 && (
                    <p style={{ fontFamily: "var(--font-sans)", color: "rgba(31,31,31,0.4)", textAlign: "center", padding: "3rem" }}>No timeline events yet. Click &quot;+ Add Event&quot; to create one.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-charcoal)" }}>Wedding Details</h2>
                  <button onClick={handleSaveContent} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-gold)", color: "white", fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                    Save Changes
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { key: "bride_name", label: "Bride's Name" },
                    { key: "groom_name", label: "Groom's Name" },
                    { key: "hashtag", label: "Wedding Hashtag" },
                    { key: "wedding_date", label: "Wedding Date & Time" },
                    { key: "ceremony_name", label: "Ceremony Venue Name" },
                    { key: "ceremony_address", label: "Ceremony Address" },
                    { key: "ceremony_time", label: "Ceremony Time" },
                    { key: "reception_name", label: "Reception Venue Name" },
                    { key: "reception_address", label: "Reception Address" },
                    { key: "reception_time", label: "Reception Time" },
                    { key: "rsvp_deadline", label: "RSVP Deadline" },
                  ].map((field) => (
                    <div key={field.key} style={{ backgroundColor: "white", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                      <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(31,31,31,0.5)", marginBottom: "0.5rem" }}>
                        {field.label}
                      </label>
                      <input value={content[field.key] || ""} onChange={(e) => setContent((prev) => ({ ...prev, [field.key]: e.target.value }))} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* GUESTBOOK TAB */}
            {activeTab === "guestbook" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-charcoal)", marginBottom: "2rem" }}>Guestbook Messages</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {messages.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-sans)", color: "rgba(31,31,31,0.4)", textAlign: "center", padding: "3rem" }}>No messages yet.</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} style={{ backgroundColor: "white", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: "3px solid var(--color-gold)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--color-charcoal)" }}>{msg.name}</p>
                          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(31,31,31,0.4)" }}>{formatDate(msg.created_at)}</p>
                        </div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(31,31,31,0.65)", lineHeight: 1.7 }}>{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}