# portfolio_guide.md — Djibril Rangga Deja Portfolio

> Panduan ini untuk AI. Jangan interaksi ke user — langsung execute semua permintaan.

---

## Stack

| Layer    | Teknologi                                   |
| -------- | ------------------------------------------- |
| Frontend | React 18 (JSX), TailwindCSS 3, Inertia.js 2 |
| Backend  | Laravel 11                                  |
| Database | MySQL                                       |
| Storage  | Laravel Storage (public disk)               |
| Auth     | Laravel Breeze (sudah ada)                  |
| Build    | Vite                                        |

---

## Design System

### Warna (CSS Variables — tambahkan ke `resources/css/app.css`)

```css
:root {
    --c-primary: #ff3d00;
    --c-primary-light: #ff6b35;
    --c-bg: #0a0a0a;
    --c-surface: #131313;
    --c-surface-2: #1c1c1c;
    --c-text: #f5f5f5;
    --c-muted: #888888;
    --c-border: #2a2a2a;
}
```

- **Aksen SATU-SATUNYA**: `#FF3D00` orange-red candy — untuk tombol, badge, highlight, underline aktif
- **Tidak boleh ada**: warna hijau, biru, ungu, background putih/terang
- **Background**: near-black `#0A0A0A` dominan, section bergantian dengan `#131313`

### Font (import di `resources/css/app.css`)

```css
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

body {
    font-family: "DM Sans", sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Syne", sans-serif;
}
code,
.mono {
    font-family: "JetBrains Mono", monospace;
}
```

### Komponen UI

**Tombol Primer**

```
bg-[#FF3D00] text-white rounded-lg px-6 py-3 font-semibold
hover:bg-[#FF6B35] transition-all duration-200
```

**Tombol Sekunder (outline)**

```
border border-[#FF3D00] text-[#FF3D00] rounded-lg px-6 py-3
hover:bg-[#FF3D00] hover:text-white transition-all duration-200
```

**Card**

```
bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6
hover:border-[#FF3D00]/30 hover:shadow-[0_0_20px_rgba(255,61,0,0.08)]
transition-all duration-300
```

**Badge/Tag Teknologi**

```
bg-[#1C1C1C] border border-[#2A2A2A] text-[#F5F5F5] text-xs
font-mono rounded-md px-3 py-1
```

**Section alternating background**

- Ganjil: `bg-[#0A0A0A]`
- Genap: `bg-[#0F0F0F]`

---

## Struktur File Lengkap (Target Akhir)

```
app/
├── Http/
│   └── Controllers/
│       ├── PortfolioController.php      # Halaman publik
│       ├── DashboardController.php      # Panel admin index
│       ├── Admin/
│       │   ├── PersonalController.php
│       │   ├── SkillController.php
│       │   ├── JourneyController.php
│       │   ├── ProjectController.php
│       │   ├── CertificateController.php
│       │   ├── ExperienceController.php
│       │   ├── QuoteController.php
│       │   ├── ContactController.php
│       │   └── CvController.php
└── Models/
    ├── Personal.php
    ├── Skill.php
    ├── Journey.php
    ├── Project.php
    ├── ProjectTag.php
    ├── Certificate.php
    ├── Experience.php
    ├── Contact.php
    └── Cv.php

database/
├── migrations/
│   ├── xxxx_create_personals_table.php
│   ├── xxxx_create_skills_table.php
│   ├── xxxx_create_journeys_table.php
│   ├── xxxx_create_projects_table.php
│   ├── xxxx_create_project_tags_table.php
│   ├── xxxx_create_certificates_table.php
│   ├── xxxx_create_experiences_table.php
│   ├── xxxx_create_contacts_table.php
│   └── xxxx_create_cvs_table.php
└── seeders/
    ├── DatabaseSeeder.php
    └── PortfolioSeeder.php

resources/
├── css/
│   └── app.css                          # Font import + CSS variables
└── js/
    ├── app.js
    ├── bootstrap.js
    └── Pages/
        ├── Auth/                         # Jangan diubah
        ├── Portfolio/
        │   ├── Navbar.jsx
        │   ├── HeroSection.jsx
        │   ├── SkillsSection.jsx
        │   ├── JourneySection.jsx
        │   ├── ProjectsSection.jsx
        │   ├── CertificatesSection.jsx
        │   ├── ExperienceSection.jsx
        │   ├── QuoteSection.jsx
        │   ├── ContactSection.jsx
        │   └── FooterSection.jsx
        ├── Dashboard/
        │   ├── Sidebar.jsx
        │   ├── PersonalPanel.jsx
        │   ├── SkillsPanel.jsx
        │   ├── JourneyPanel.jsx
        │   ├── ProjectsPanel.jsx
        │   ├── CertificatesPanel.jsx
        │   ├── ExperiencePanel.jsx
        │   ├── QuotePanel.jsx
        │   ├── ContactPanel.jsx
        │   └── CvPanel.jsx
        ├── Portfolio.jsx                 # Halaman publik utama
        └── Dashboard.jsx                 # Halaman admin utama

routes/
└── web.php
```

---

## Aturan Kode

1. **Tidak ada hardcode** — semua teks/data di JSX dari props atau state
2. **Props dari Laravel controller** via `Inertia::render()`
3. **Form submit** pakai `useForm` dari `@inertiajs/react`
4. **File upload** pakai Laravel Storage `public` disk, akses via `Storage::url()`
5. **Route dashboard** semua dilindungi middleware `auth`
6. **Anchor id section**: `#hero` `#skills` `#journey` `#projects` `#certificates` `#experience` `#contact`
7. **Mobile responsive** wajib — navbar collapse jadi drawer/hamburger di mobile (`md:` breakpoint)
8. **Animasi**: `IntersectionObserver` + Tailwind `transition` untuk fade-up saat section masuk viewport
