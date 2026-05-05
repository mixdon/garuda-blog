"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    api.get(`/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => router.push("/posts"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!confirm("Hapus post ini?")) return;
    await api.delete(`/api/posts/${id}`);
    router.push("/posts");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow mb-6 px-6">
        <div className="flex-1">
          <Link href="/posts" className="text-xl font-bold">Garuda Blog</Link>
        </div>
      </div>
      <div className="container mx-auto max-w-2xl px-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p className="text-sm text-gray-500">
              oleh {post?.user?.name} •{" "}
              {new Date(post?.created_at).toLocaleDateString("id-ID")}
            </p>
            <div className="divider" />
            <p className="whitespace-pre-wrap text-gray-700">{post?.body}</p>
            <div className="flex gap-2 justify-end mt-4">
              <Link href="/posts" className="btn btn-ghost btn-sm">← Kembali</Link>
              {user?.id === post?.user_id && (
                <>
                  <Link href={`/posts/${id}/edit`} className="btn btn-warning btn-sm">Edit</Link>
                  <button onClick={handleDelete} className="btn btn-error btn-sm">Hapus</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}