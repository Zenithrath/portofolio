<?php

namespace App\Http\Controllers;

use App\Models\Personal;
use App\Models\Skill;
use App\Models\Journey;
use App\Models\Project;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Contact;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'personal'     => Personal::first(),
            'skills'       => Skill::orderBy('sort_order')->get(),
            'journey'      => Journey::orderBy('sort_order')->get(),
            'projects'     => Project::with('tags')->orderBy('sort_order')->get(),
            'certificates' => Certificate::orderBy('sort_order')->get(),
            'experiences'  => Experience::orderBy('sort_order')->get(),
            'contacts'     => Contact::orderBy('sort_order')->get(),
        ]);
    }
}
