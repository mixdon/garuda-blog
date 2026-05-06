"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #d5d8dc",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    background: "#f8f9fa",
    color: "#1c1c1c",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #922b21 0%, #5a1a12 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.8)",
              overflow: "hidden", margin: "0 auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
              <Image src="/garuda.jpg" alt="Garuda" width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 16, height: 16, borderRadius: "50%",
              background: "#2ecc71", border: "2px solid #fff",
            }} />
          </div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0 }}>Garuda Blog</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>
            PT Garuda Cyber Indonesia
          </p>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Buat Akun Baru</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Bergabung dengan komunitas kami</p>
          </div>

          {error && (
            <div style={{
              background: "#fdf0f0", color: "#9b2335",
              border: "0.5px solid #f5c6c6", borderRadius: 6,
              padding: "10px 14px", fontSize: 13, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Nama Lengkap</label>
              <input type="text" placeholder="Nama lengkap Anda" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Alamat Email</label>
              <input type="email" placeholder="nama@email.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" placeholder="Min. 8 karakter" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Konfirmasi Password</label>
              <input type="password" placeholder="Ulangi password" value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "11px",
                background: loading ? "#aaa" : "#922b21",
                color: "#fff", border: "none", borderRadius: 6,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
              }}
            >
              {loading ? "Memproses..." : "Daftar Sekarang →"}
            </button>
          </form>

          <div style={{ borderTop: "1px solid var(--border)", margin: "20px 0", textAlign: "center", position: "relative" }}>
            <span style={{
              background: "#fff", padding: "0 10px",
              color: "var(--text-muted)", fontSize: 11,
              position: "relative", top: -10,
            }}>ATAU</span>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "#922b21", fontWeight: 600, textDecoration: "none" }}>
              Masuk sekarang
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 20 }}>
          © 2026 PT Garuda Cyber Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  );
}