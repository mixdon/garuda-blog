<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')->latest()->paginate(10);
        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::with('user')->find($id);

        if (! $post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        return response()->json($post);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title'   => $request->title,
            'body'    => $request->body,
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (! $post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post->update([
            'title' => $request->title,
            'body'  => $request->body,
        ]);

        return response()->json($post);
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::find($id);

        if (! $post) {
            return response()->json(['message' => 'Post tidak ditemukan.'], 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post berhasil dihapus.']);
    }
}