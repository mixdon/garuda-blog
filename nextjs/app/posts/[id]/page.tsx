"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import { IconEdit, IconTrash, IconArrowLeft } from "@/app/components/Icons";

export default function PostDetailPage() {
const router = useRouter();
const { id } = useParams();
const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
    }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    api
    .get(`/api/posts/${id}`)
    .then((res) => setPost(res.data))
    .catch(() => router.push("/posts"))
    .finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
    if (!confirm("Hapus post ini?")) return;
    await api.delete(`/api/posts/${id}`);
    router.push("/posts");
    };

    if (loading)
    return (
    <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-muted)",
        }}>
      <span className="loading loading-spinner loading-md" style={{ color: "var(--brand)" }} />
    </div>
    );

    return (
    <div style={{ minHeight: "100vh", background: "var(--surface-muted)" }}>
      {/* ── Navbar ── */}
      <Navbar user={user} />

      {/* ── Body ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px" }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/posts">Semua Post</Link>
          <span>/</span>
          <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 360,
            }}>
            {post?.title}
          </span>
        </div>

        {/* Article card */}
        <div className="detail-card">
          {/* Red header strip */}
          <div className="detail-card-header">
            <span style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: ".5px",
              }}>
              Artikel
            </span>
            <h1 style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                marginTop: 4,
                lineHeight: 1.3,
              }}>
              {post?.title}
            </h1>
          </div>

          <div className="detail-card-body">
            {/* Author row */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "0.5px solid var(--border)",
              }}>
              <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {post?.user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  {post?.user?.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  {new Date(post?.created_at).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Featured image jika ada */}
            {post?.image_path && (
            <div style={{ marginBottom: 20 }}>
              <img src={post.image_url || ""} alt={post.title} style={{
                    width: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "0.5px solid var(--border)",
                  }} />
            </div>
            )}

            {/* Body */}
            <div style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
              }}>
              {post?.body}
            </div>

            {/* Owner actions */}
            {user?.id === post?.user_id && (
            <div style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: "0.5px solid var(--border)",
                }}>
              <Link href={`/posts/${id}/edit`} style={{
                    background: "#f39c12",
                    color: "#fff",
                    borderRadius: 3,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
              <IconEdit size={13} /> Edit Post
              </Link>

              <button onClick={handleDelete} style={{
                    background: "#e74c3c",
                    color: "#fff",
                    borderRadius: 3,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                <IconTrash size={13} /> Hapus Post
              </button>
            </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 16 }}>
          <Link href="/posts" style={{
              fontSize: 13,
              color: "var(--brand)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}>
          <IconArrowLeft size={13} /> Kembali ke semua post
          </Link>
        </div>
      </div>
    </div>
    );
    }