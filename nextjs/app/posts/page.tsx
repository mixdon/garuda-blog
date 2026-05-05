"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Post {
  id: number;
  title: string;
  body: string;
  user_id: number;
  user: { id: number; name: string };
  created_at: string;
}

interface PaginationData {
  data: Post[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    if (stored) setUser(JSON.parse(stored));
    fetchPosts(1);
  }, []);

  const fetchPosts = async (p: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/posts?page=${p}`);
      setPosts(res.data);
      setPage(p);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
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
    await api.delete(`/api/posts/${id}`);
    fetchPosts(page);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow mb-6 px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">Garuda Blog</span>
        </div>
        <div className="flex-none flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <Link href="/posts/new" className="btn btn-primary btn-sm">
            + Post Baru
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : posts?.data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Belum ada post. Buat yang pertama!
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {posts?.data.map((post) => (
                <div key={post.id} className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="text-sm text-gray-500">
                      oleh {post.user?.name} •{" "}
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <p className="text-gray-600 line-clamp-2">{post.body}</p>
                    <div className="card-actions justify-end gap-2 mt-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Detail
                      </Link>
                      {user?.id === post.user_id && (
                        <>
                          <Link
                            href={`/posts/${post.id}/edit`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="btn btn-error btn-sm"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts && posts.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: posts.last_page }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => fetchPosts(p)}
                      className={`btn btn-sm ${
                        p === page ? "btn-primary" : "btn-ghost"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}