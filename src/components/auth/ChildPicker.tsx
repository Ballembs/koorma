"use client";

import { useKoormaStore, UserProfile } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ChildPicker() {
  const router = useRouter();
  const state = useKoormaStore();
  const profiles = state.profiles || [];
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleSelect = (profile: UserProfile) => {
    state.setActiveProfile(profile.id!);
    // Hydrate the legacy root state for backwards compatibility with V1 components
    state.updateProfile({
      childName: profile.childName,
      childNickname: profile.childNickname,
      childAge: profile.childAge,
      teluguLevel: profile.teluguLevel,
      friends: profile.friends,
    });
    router.push("/village");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProfile: UserProfile = {
      id: `child-${Date.now()}`,
      childName: newName.trim(),
      childNickname: newName.trim(),
      childAge: 5,
      avatarEmoji: "🐢",
      displayName: newName.trim(),
      teluguLevel: 1,
      friends: [],
    };

    state.addProfile(newProfile);
    setIsAdding(false);
    setNewName("");
    handleSelect(newProfile); // Auto-login new child
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "linear-gradient(135deg, #1A1A2E, #2D1B4E)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'Nunito', sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏡</div>
        <h1 style={{ color: "white", fontSize: 40, fontWeight: 800, margin: 0 }}>Who is playing?</h1>
      </motion.div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }}>
        {profiles.map(p => (
          <motion.button
            key={p.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(p)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: 32,
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              cursor: "pointer",
              minWidth: 160,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)"
            }}
          >
            <div style={{ fontSize: 64 }}>{p.avatarEmoji || "🐢"}</div>
            <div style={{ color: "white", fontSize: 24, fontWeight: 800 }}>{p.childName}</div>
          </motion.button>
        ))}

        {/* Add New Child Button */}
        <AnimatePresence mode="wait">
          {!isAdding ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(true)}
              style={{
                background: "transparent",
                border: "2px dashed rgba(255,255,255,0.3)",
                borderRadius: 32,
                padding: "32px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                cursor: "pointer",
                minWidth: 160,
              }}
            >
              <div style={{ fontSize: 48, color: "rgba(255,255,255,0.5)" }}>➕</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, fontWeight: 800 }}>Add Child</div>
            </motion.button>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleAdd}
              style={{
                background: "white",
                borderRadius: 32,
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 240,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, color: "#1A1A2E", textAlign: "center", fontWeight: 800 }}>New Profile</h3>
              <input
                autoFocus
                type="text"
                placeholder="Child's Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #E0E0E0",
                  fontSize: 16,
                  fontFamily: "'Nunito', sans-serif",
                  outline: "none"
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#F5F5F5", color: "#666", fontWeight: 800, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#1565C0", color: "white", fontWeight: 800, cursor: "pointer", opacity: newName.trim() ? 1 : 0.5 }}
                >
                  Create
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
