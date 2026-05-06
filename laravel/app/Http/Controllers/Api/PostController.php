<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * List posts (pagination + optional filter mine + search)
     * 
     * Query parameters:
     * - page: halaman (default 1)
     * - mine: filter posts user (optional, nilai 1 untuk aktif)
     * - search: cari dalam title dan body (optional)
     * 
     * Returns: paginated posts dengan struktur:
     * {
     *   "data": [...posts],
     *   "current_page": 1,
     *   "last_page": 5,
     *   "total": 47,
     *   "per_page": 10
     * }
     */
    public function index(Request $request)
    {
        $query = Post::with('user')->latest();

        // Filter: hanya posts milik user yang login
        if ($request->boolean('mine')) {
            $query->where('user_id', $request->user()->id);
        }

        // Search: cari dalam title dan body (case-insensitive)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
            });
        }

        // Return paginated results (10 per page)
        return response()->json($query->paginate(10));
    }

    /**
     * Show single post by ID
     */
    public function show($id)
    {
        $post = Post::with('user')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        return response()->json($post);
    }

    /**
     * Create new post (support image upload)
     * 
     * Request body:
     * {
     *   "title": "string (required, max 255)",
     *   "body": "string (required)",
     *   "image": "file (optional, image format)"
     * }
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('posts', 'public')
            : null;

        $post = Post::create([
            'user_id'    => $request->user()->id,
            'title'      => $request->title,
            'body'       => $request->body,
            'image_path' => $imagePath,
        ]);

        return response()->json($post->load('user'), 201);
    }

    /**
     * Update post (support replace/remove image)
     * 
     * Request body:
     * {
     *   "title": "string (required, max 255)",
     *   "body": "string (required)",
     *   "image": "file (optional, image format)",
     *   "remove_image": "boolean (optional, set image to null)"
     * }
     */
    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        // Authorization: hanya user pembuat post yang bisa edit
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'title'        => 'required|string|max:255',
            'body'         => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_image' => 'nullable|boolean',
        ]);

        $imagePath = $post->image_path;

        // Handle remove image
        if ($request->boolean('remove_image') && $imagePath) {
            Storage::disk('public')->delete($imagePath);
            $imagePath = null;
        }

        // Handle new image upload
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        // Update post
        $post->update([
            'title'      => $request->title,
            'body'       => $request->body,
            'image_path' => $imagePath,
        ]);

        return response()->json($post->load('user'));
    }

    /**
     * Delete post
     * 
     * Authorization: hanya user pembuat post yang bisa delete
     */
    public function destroy(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        // Authorization: hanya user pembuat post yang bisa delete
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        // Delete image jika ada
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return response()->json(['message' => 'Post berhasil dihapus.']);
    }
}