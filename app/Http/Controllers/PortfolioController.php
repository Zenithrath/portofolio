<?php

namespace App\Http\Controllers;

use App\Models\Personal;
use App\Models\Skill;
use App\Models\Journey;
use App\Models\Project;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Contact;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $personal = Personal::first();
        return Inertia::render('Portfolio', [
            'personal'     => $personal ? [
                ...$personal->toArray(),
                'photo_url' => $personal->photo ? Storage::url($personal->photo) : null,
                'cv_url'    => $personal->cv_file ? Storage::url($personal->cv_file) : null,
            ] : null,
            'skills'       => [
                'tech' => Skill::where('category','tech')->where('is_visible',true)->orderBy('sort_order')->get(),
                'hard' => Skill::where('category','hard')->where('is_visible',true)->orderBy('sort_order')->get(),
                'soft' => Skill::where('category','soft')->where('is_visible',true)->orderBy('sort_order')->get(),
            ],
            'journey'      => Journey::where('is_visible',true)->orderBy('sort_order')->get()->map(fn($item) => [...$item->toArray(), 'image_url' => $item->image ? Storage::url($item->image) : null]),
            'projects'     => Project::with('tags')->where('is_visible',true)->orderBy('sort_order')->get()
                                ->map(fn($p) => [...$p->toArray(), 'thumbnail_url' => $p->thumbnail ? Storage::url($p->thumbnail) : null]),
            'certificates' => Certificate::where('is_visible',true)->orderBy('sort_order')->get()
                                ->map(fn($c) => [...$c->toArray(), 'image_url' => $c->image ? Storage::url($c->image) : null]),
            'experiences'  => Experience::where('is_visible',true)->orderBy('sort_order')->get(),
            'contacts'     => Contact::where('is_visible',true)->orderBy('sort_order')->get(),
        ]);
    }
}
