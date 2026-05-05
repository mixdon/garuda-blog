# Garuda Blog

Aplikasi blog sederhana dengan fitur autentikasi dan manajemen post, dibangun menggunakan Laravel sebagai backend REST API dan Next.js sebagai frontend.

## Tech Stack

- **Backend**: Laravel 13 + Laravel Sanctum  
- **Frontend**: Next.js 16 (App Router) + TailwindCSS + DaisyUI  
- **Database**: MySQL  

## Struktur Proyek

```
garuda-blog/
├── laravel/          # Backend REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── PostController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Post.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env.example
│
├── nextjs/           # Frontend Next.js
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── posts/page.tsx
│   │   ├── posts/new/page.tsx
│   │   ├── posts/[id]/page.tsx
│   │   └── posts/[id]/edit/page.tsx
│   ├── lib/api.ts
│   └── .env.example
│
└── README.md
```

## Cara Menjalankan

### Prasyarat

- PHP >= 8.2  
- Composer  
- Node.js >= 18  
- MySQL  

---

## Backend (Laravel)

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
```

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=garuda_blog
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
SESSION_DRIVER=cookie
```

Buat database:

```sql
CREATE DATABASE garuda_blog 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

Jalankan backend:

```bash
php artisan install:api
php artisan migrate
php artisan serve
```

API berjalan di: **http://127.0.0.1:8000**

---

## Frontend (Next.js)

```bash
cd nextjs
npm install
cp .env.example .env.local
```

Edit file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Jalankan frontend:

```bash
npm run dev
```

Aplikasi berjalan di: **http://localhost:3000**

---

## API Endpoints

### Autentikasi

| Method | Endpoint        | Keterangan                     |
|--------|----------------|-------------------------------|
| POST   | /api/register  | Registrasi user baru          |
| POST   | /api/login     | Login dan mendapatkan token   |
| POST   | /api/logout    | Logout dan hapus token        |

### Posts (memerlukan autentikasi)

| Method | Endpoint             | Keterangan                          |
|--------|---------------------|------------------------------------|
| GET    | /api/posts          | List semua post (10 per halaman)   |
| GET    | /api/posts/{id}     | Detail post                        |
| POST   | /api/posts          | Buat post baru                     |
| PUT    | /api/posts/{id}     | Edit post (hanya pemilik)          |
| DELETE | /api/posts/{id}     | Hapus post (hanya pemilik)         |

---

## HTTP Status Code

| Code | Keterangan                       |
|------|---------------------------------|
| 200  | OK                              |
| 201  | Created                         |
| 401  | Unauthorized                    |
| 403  | Forbidden (bukan pemilik post)  |
| 404  | Not Found                       |
| 422  | Validation Error                |

---

## Fitur

- Register, Login, Logout menggunakan Laravel Sanctum (token-based)  
- Menampilkan semua post dengan pagination server-side (10 per halaman)  
- Melihat detail post  
- Membuat post baru  
- Mengedit post (hanya pemilik)  
- Menghapus post (hanya pemilik)  
- Tombol Edit dan Hapus hanya tampil untuk pemilik post  
- UI menggunakan DaisyUI  

---

## Keputusan Teknis

- **Autentikasi** menggunakan Laravel Sanctum dengan token-based authentication. Token disimpan di localStorage dan dikirim melalui header Authorization.  
- **Pagination** dilakukan di sisi server menggunakan `->paginate(10)` pada query Eloquent.  
- **Authorization**: user hanya bisa mengedit dan menghapus post miliknya sendiri. Jika bukan pemilik, API mengembalikan HTTP 403 Forbidden.  
- **Axios interceptor** digunakan untuk menyisipkan token Bearer secara otomatis pada setiap request ke API.  
- **App Router** Next.js digunakan untuk routing berbasis folder.  
- **DaisyUI** digunakan sebagai komponen UI di atas TailwindCSS.  

## Docker Compose (Bonus)

Jalankan seluruh stack sekaligus menggunakan Docker:

### Prasyarat
- Docker Desktop terinstall dan berjalan

### Jalankan
```bash
docker compose up --build
```

Services yang berjalan:
- **db** — MySQL 8.0 di port 3306
- **laravel** — Backend API di port 8000
- **nextjs** — Frontend di port 3000