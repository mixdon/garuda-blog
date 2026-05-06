"use client";

import Link from "next/link";

interface NavbarProps {
  user?: { id: number; name: string } | null;
  onLogout?: () => void;
  showNewPost?: boolean;
}

export default function Navbar({ user, onLogout, showNewPost = false }: NavbarProps) {
  return (
    <nav
      className="navbar-garuda px-4"
      style={{ height: 48, display: "flex", alignItems: "center", gap: 12 }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <div
          style={{
            width: 30,
            height: 30,
            background: "#fff",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "var(--brand)", fontWeight: 700, fontSize: 13 }}>G</span>
        </div>
        <Link
          href="/posts"
          style={{ color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none" }}
        >
          Garuda Blog
        </Link>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          · PT Garuda Cyber Indonesia
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* User chip */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 3,
              padding: "4px 10px",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "var(--brand)", fontSize: 10, fontWeight: 700 }}>
                {user.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <span
              style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}
              className="hidden sm:block"
            >
              {user.name}
            </span>
          </div>
        )}

        {/* New post button */}
        {showNewPost && (
          <Link
            href="/posts/new"
            style={{
              background: "#fff",
              color: "var(--brand)",
              borderRadius: 3,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + Post Baru
          </Link>
        )}

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.8)",
              border: "0.5px solid rgba(255,255,255,0.4)",
              borderRadius: 3,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Keluar
          </button>
        )}
      </div>
    </nav>
  );
}