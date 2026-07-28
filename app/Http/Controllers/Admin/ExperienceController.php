<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company'     => 'required|string|max:200',
            'position'    => 'required|string|max:200',
            'type'        => 'required|in:fulltime,parttime,internship,freelance,organization',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'is_current'  => 'nullable|boolean',
            'description' => 'required|string|max:1000',
            'location'    => 'nullable|string|max:200',
            'is_visible'  => 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        $experienceData = $request->only([
            'company', 'position', 'type', 'start_date', 'end_date', 'description', 'location', 'sort_order'
        ]);

        $experienceData['is_current'] = $request->boolean('is_current', false);
        $experienceData['is_visible'] = $request->boolean('is_visible', true);
        if (!isset($experienceData['sort_order'])) {
            $experienceData['sort_order'] = 0;
        }

        if ($experienceData['is_current']) {
            $experienceData['end_date'] = null;
        }

        Experience::create($experienceData);

        return back()->with('success', 'Pengalaman kerja berhasil ditambahkan.');
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'company'     => 'required|string|max:200',
            'position'    => 'required|string|max:200',
            'type'        => 'required|in:fulltime,parttime,internship,freelance,organization',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'is_current'  => 'nullable|boolean',
            'description' => 'required|string|max:1000',
            'location'    => 'nullable|string|max:200',
            'is_visible'  => 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        $experienceData = $request->only([
            'company', 'position', 'type', 'start_date', 'end_date', 'description', 'location', 'sort_order'
        ]);

        $experienceData['is_current'] = $request->boolean('is_current', false);
        $experienceData['is_visible'] = $request->boolean('is_visible', false);

        if ($experienceData['is_current']) {
            $experienceData['end_date'] = null;
        }

        $experience->update($experienceData);

        return back()->with('success', 'Pengalaman kerja berhasil diperbarui.');
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return back()->with('success', 'Pengalaman kerja berhasil dihapus.');
    }
}
