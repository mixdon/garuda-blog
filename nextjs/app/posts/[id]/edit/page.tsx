"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import { IconEdit, IconImage, IconArrowLeft } from "@/app/components/Icons";

export default function EditPostPage() {
const router = useRouter();
const { id } = useParams();
const [form, setForm] = useState({ title: "", body: "" });
const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
      const [removeImage, setRemoveImage] = useState(false);
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
      const [user, setUser] = useState<any>(null);
        const fileRef = useRef<HTMLInputElement>(null);

          useEffect(() => {
          if (!localStorage.getItem("token")) {
          router.push("/login");
          return;
          }
          const stored = localStorage.getItem("user");
          if (stored) setUser(JSON.parse(stored));

          api
          .get(`/api/posts/${id}`)
          .then((res) => {
          setForm({ title: res.data.title, body: res.data.body });
          setCurrentImage(res.data.image_url || null);
          })
          .catch(() => router.push("/posts"));
          }, []);

          const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImageFile(file);
            setRemoveImage(false);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            };

            const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError("");

            try {
            // Jika ada image baru atau remove, pakai FormData (multipart)
            if (imageFile || removeImage) {
            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("body", form.body);
            fd.append("_method", "PUT"); // Laravel method spoofing
            if (imageFile) fd.append("image", imageFile);
            if (removeImage) fd.append("remove_image", "1");
            await api.post(`/api/posts/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
            });
            } else {
            await api.put(`/api/posts/${id}`, form);
            }
            router.push(`/posts/${id}`);
            } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengupdate post.");
            } finally {
            setLoading(false);
            }
            };

            return (
            <div style={{ minHeight: "100vh", background: "var(--surface-muted)" }}>
              {/* ── Navbar ── */}
              <Navbar user={user} />

              <div style={{ maxWidth: 740, margin: "0 auto", padding: "20px 16px" }}>
                {/* Breadcrumb */}
                <div className="breadcrumb">
                  <Link href="/posts">Semua Post</Link>
                  <span>/</span>
                  <Link href={`/posts/${id}`}>Detail </Link> <span>/</span>
                  <span>Edit</span>
                </div>

                {/* Form card */}
                <div className="form-card">
                  <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <IconEdit size={15} />
                    Edit Post
                  </div>

                  <div className="form-card-body">
                    {error && (
                    <div className="alert-error" style={{ marginBottom: 16 }}>
                      {error}
                    </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* Judul */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}>
                          Judul Post
                        </label>
                        <input type="text" placeholder="Masukkan judul yang menarik..."
                          className="input input-bordered w-full" style={{ borderRadius: 3, fontSize: 14 }}
                          value={form.title} onChange={(e)=> setForm({ ...form, title: e.target.value })}
                        required
                        />
                      </div>

                      {/* Isi */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}>
                          Isi Post
                        </label>
                        <textarea placeholder="Tulis isi post di sini..." className="textarea textarea-bordered w-full"
                          style={{ borderRadius: 3, fontSize: 14, height: 220, resize: "vertical" }} value={form.body}
                          onChange={(e)=> setForm({ ...form, body: e.target.value })}
                  required
                />
              </div>

              {/* Gambar */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  Gambar (opsional)
                </label>

                {/* Preview gambar existing atau baru */}
                {(imagePreview || (currentImage && !removeImage)) && (
                  <div style={{ marginBottom: 8, position: "relative", display: "inline-block" }}>
                    <img 
                      src={imagePreview || currentImage || ""}
                      alt="preview"
                      style={{
                        maxHeight: 180,
                        maxWidth: "100%",
                        borderRadius: 4,
                        border: "0.5px solid var(--border)",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setRemoveImage(true);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    border: "0.5px dashed var(--border-strong)",
                    borderRadius: 3,
                    background: "var(--surface-muted)",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <IconImage size={14} />
                  {imageFile ? "Ganti Gambar" : currentImage ? "Ganti Gambar" : "Upload Gambar"}
                </button>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  JPG, PNG, WebP. Maks 2MB.
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  paddingTop: 16,
                  borderTop: "0.5px solid var(--border)",
                }}
              >
                <Link
                  href={`/posts/${id}`}
                  className="btn-outline"
                  style={{ textDecoration: "none", padding: "7px 16px", fontSize: 13 }}
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="btn-brand"
                  disabled={loading}
                  style={{
                    minWidth: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <IconEdit size={13} />
                  )}
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Back */}
        <div style={{ marginTop: 12 }}>
          <Link
            href={`/posts/${id}`}
            style={{
              fontSize: 13,
              color: "var(--brand)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconArrowLeft size={13} /> Kembali ke detail post
          </Link>
        </div>
      </div>
    </div>
  );
}