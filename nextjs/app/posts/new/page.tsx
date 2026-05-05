"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", body: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/posts", form);
      router.push("/posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat post.");
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="card-title text-2xl mb-4">Buat Post Baru</h2>
            {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Judul</span>
                </label>
                <input
                  type="text"
                  placeholder="Judul post"
                  className="input input-bordered w-full"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Isi</span>
                </label>
                <textarea
                  placeholder="Tulis isi post di sini..."
                  className="textarea textarea-bordered w-full h-48"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Link href="/posts" className="btn btn-ghost">Batal</Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}