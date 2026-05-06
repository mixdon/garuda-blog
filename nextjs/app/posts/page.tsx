"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import {
  IconEdit,
  IconTrash,
  IconDocument,
  IconChevronUp,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@/app/components/Icons";

interface Post {
  id: number;
  title: string;
  body: string;
  user_id: number;
  image_path: string | null;
  image_url: string | null;
  user: { id: number; name: string };
  created_at: string;
}

interface PaginationData {
  data: Post[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

type FilterMode = "all" | "mine";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Initial load
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchPosts(1, "all", "");
  }, []);

  /**
   * Main fetch function untuk posts
   * Menerima parameter: pageNum, filterMode, dan search query
   * Automatically reset ke halaman 1 jika search/filter berubah
   */
  const fetchPosts = useCallback(
    async (pageNum: number, filterMode: FilterMode, searchStr: string = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(pageNum) });

        // Add filter parameter jika "mine"
        if (filterMode === "mine") {
          params.append("mine", "1");
        }

        // Add search parameter jika ada
        if (searchStr.trim()) {
          params.append("search", searchStr.trim());
        }

        const res = await api.get(`/api/posts?${params.toString()}`);
        setPosts(res.data);
        setPage(pageNum);
        setFilter(filterMode);
        setSearchQuery(searchStr);
      } catch (error) {
        console.error("Error fetching posts:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Handle filter change (Semua Post / Post Saya)
   * Reset ke halaman 1 dan maintain search query
   */
  const handleFilterChange = (f: FilterMode) => {
    if (f === filter) return;
    fetchPosts(1, f, searchQuery);
  };

  /**
   * Handle search form submission
   * Reset ke halaman 1 dengan search query baru
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput === searchQuery) return; // Avoid refetch jika sama
    fetchPosts(1, filter, searchInput);
  };

  /**
   * Clear search
   * Kembali ke halaman 1 dengan filter aktif, tanpa search
   */
  const handleClearSearch = () => {
    setSearchInput("");
    fetchPosts(1, filter, "");
  };

  /**
   * Handle pagination - maintains current filter dan search
   */
  const handlePagination = (newPage: number) => {
    if (newPage < 1 || (posts && newPage > posts.last_page)) return;
    fetchPosts(newPage, filter, searchQuery);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus post ini?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      // Refetch dengan parameter yang sama
      fetchPosts(page, filter, searchQuery);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Gagal menghapus post");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /**
   * Generate pagination page numbers dengan ellipsis
   */
  const getPaginationPages = (current: number, last: number): (number | "...")[] => {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", last);
    } else if (current >= last - 3) {
      pages.push(1, "...", last - 4, last - 3, last - 2, last - 1, last);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", last);
    }
    return pages;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-muted)" }}>
      {/* ── NAVBAR ── */}
      <Navbar user={user} onLogout={handleLogout} showNewPost />

      {/* ── PAGE LAYOUT ── */}
      <div className="page-layout">
        {/* ── MAIN CONTENT ── */}
        <div className="page-main">
          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            style={{
              marginBottom: 16,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface)",
                border: "0.5px solid var(--border-strong)",
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              <IconSearch size={18} style={{ color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconX size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                background: "var(--brand)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Cari
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  padding: "8px 12px",
                  background: "var(--surface-muted)",
                  color: "var(--text-secondary)",
                  border: "0.5px solid var(--border-strong)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Reset
              </button>
            )}
          </form>

          {/* FILTER / SORT BAR */}
          <div className="sort-bar mb-3">
            <button
              className={`sort-bar-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              Semua Post
            </button>
            <button
              className={`sort-bar-btn ${filter === "mine" ? "active" : ""}`}
              onClick={() => handleFilterChange("mine")}
            >
              Post Saya
            </button>
          </div>

          {/* POST COUNT & PAGINATION INFO */}
          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {posts?.total ?? 0} artikel{filter === "mine" ? " milik saya" : ""}{searchQuery && ` (cari: "${searchQuery}")`}
            </span>
            {posts && posts.last_page > 1 && (
              <span>
                Halaman {page} dari {posts.last_page}
              </span>
            )}
          </div>

          {/* CONTENT STATES */}
          {loading ? (
            // LOADING STATE
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <span
                className="loading loading-spinner loading-md"
                style={{ color: "var(--brand)" }}
              />
            </div>
          ) : posts?.data.length === 0 ? (
            // EMPTY STATE
            <div className="detail-card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <IconDocument size={48} />
              </div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                {searchQuery
                  ? 'Tidak ada hasil pencarian'
                  : filter === "mine"
                  ? "Kamu belum punya post"
                  : "Belum ada post"}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginBottom: 20,
                }}
              >
                {searchQuery
                  ? `Coba cari dengan kata kunci lain`
                  : filter === "mine"
                  ? "Yuk mulai tulis artikel pertamamu!"
                  : "Jadilah yang pertama menulis artikel!"}
              </p>
              {!searchQuery && (
                <Link
                  href="/posts/new"
                  className="btn-brand"
                  style={{ textDecoration: "none", padding: "8px 20px" }}
                >
                  + Buat Post Pertama
                </Link>
              )}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    padding: "8px 20px",
                    background: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                    border: "0.5px solid var(--border-strong)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Hapus Filter Pencarian
                </button>
              )}
            </div>
          ) : (
            // POST CARDS LIST
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {posts?.data.map((post) => (
                <div key={post.id} className="post-card">
                  {/* VOTE COLUMN */}
                  <div className="post-vote-col">
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconChevronUp />
                    </button>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      —
                    </span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconChevronDown />
                    </button>
                  </div>

                  {/* POST BODY */}
                  <div className="post-body-col">
                    {/* THUMBNAIL IMAGE */}
                    {post.image_path && (
                      <div style={{ marginBottom: 8 }}>
                        <img
                          src={post.image_url || ""}
                          alt={post.title}
                          style={{
                            width: "100%",
                            maxHeight: 160,
                            objectFit: "cover",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    )}

                    {/* META INFO */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "var(--brand)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>
                          {post.user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {post.user?.name}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>·</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {formatDate(post.created_at)}
                      </span>
                      {user?.id === post.user_id && (
                        <span className="badge-owner">Saya</span>
                      )}
                    </div>

                    {/* TITLE */}
                    <Link href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                      <h2
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                        className="hover:text-red-700 transition-colors"
                      >
                        {post.title}
                      </h2>
                    </Link>

                    {/* EXCERPT */}
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.45,
                        marginBottom: 8,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.body}
                    </p>

                    {/* FOOTER ACTIONS */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        href={`/posts/${post.id}`}
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          padding: "3px 8px",
                          borderRadius: 2,
                          background: "var(--surface-muted)",
                        }}
                        className="hover:bg-gray-200 transition-colors"
                      >
                        Baca selengkapnya
                      </Link>

                      {user?.id === post.user_id && (
                        <>
                          <Link
                            href={`/posts/${post.id}/edit`}
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              textDecoration: "none",
                              padding: "3px 8px",
                              borderRadius: 2,
                              background: "var(--surface-muted)",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            className="hover:bg-gray-200 transition-colors"
                          >
                            <IconEdit /> Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(post.id)}
                            style={{
                              fontSize: 12,
                              color: "#c0392b",
                              padding: "3px 8px",
                              borderRadius: 2,
                              background: "#fdf0f0",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <IconTrash /> Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAGINATION ── */}
          {posts && posts.last_page > 1 && (
            <div
              style={{
                display: "flex",
                gap: 4,
                marginTop: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* PREV BUTTON */}
              <button
                onClick={() => handlePagination(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "5px 10px",
                  border: "0.5px solid var(--border-strong)",
                  borderRadius: 3,
                  background: "var(--surface)",
                  fontSize: 13,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                  transition: "all 0.2s",
                }}
              >
                «
              </button>

              {/* PAGE NUMBERS */}
              {getPaginationPages(page, posts.last_page).map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    style={{
                      padding: "5px 6px",
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePagination(p as number)}
                    style={{
                      padding: "5px 10px",
                      border: "0.5px solid var(--border-strong)",
                      borderRadius: 3,
                      fontSize: 13,
                      cursor: "pointer",
                      background: p === page ? "var(--brand)" : "var(--surface)",
                      color: p === page ? "#fff" : "var(--text-primary)",
                      borderColor: p === page ? "var(--brand)" : "var(--border-strong)",
                      transition: "all 0.2s",
                    }}
                  >
                    {p}
                  </button>
                )
              )}

              {/* NEXT BUTTON */}
              <button
                onClick={() => handlePagination(page + 1)}
                disabled={page === posts.last_page}
                style={{
                  padding: "5px 10px",
                  border: "0.5px solid var(--border-strong)",
                  borderRadius: 3,
                  background: "var(--surface)",
                  fontSize: 13,
                  cursor: page === posts.last_page ? "not-allowed" : "pointer",
                  opacity: page === posts.last_page ? 0.4 : 1,
                  transition: "all 0.2s",
                }}
              >
                »
              </button>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="page-sidebar hidden lg:block">
          <div className="sidebar-widget">
            <div className="sidebar-widget-header">Tentang Garuda Blog</div>
            <div
              className="sidebar-widget-body"
              style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Platform blog internal PT Garuda Cyber Indonesia. Berbagi artikel, tutorial, dan
              pengalaman seputar teknologi.
              <div style={{ marginTop: 12 }}>
                <Link
                  href="/posts/new"
                  className="btn-brand"
                  style={{ textDecoration: "none", display: "block", textAlign: "center", padding: "7px" }}
                >
                  + Buat Post Baru
                </Link>
              </div>
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="sidebar-widget-header">Topik</div>
            <div className="sidebar-widget-body">
              {["laravel", "next.js", "mysql", "api", "docker", "tailwind", "php", "react"].map(
                (t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="sidebar-widget-header">Panduan Komunitas</div>
            <div
              className="sidebar-widget-body"
              style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              <p>· Tulis dengan jelas dan informatif</p>
              <p>· Sertakan contoh kode bila relevan</p>
              <p>· Hargai sesama anggota</p>
              <p>· Hindari duplikasi artikel</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}