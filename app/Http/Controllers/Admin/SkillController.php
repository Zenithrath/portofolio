<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'category'    => 'required|in:tech,hard,soft',
            'icon'        => 'nullable|string|max:100',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'sort_order'  => 'nullable|integer',
            'is_visible'  => 'nullable|boolean',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = true;
        }
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        Skill::create($validated);

        return back()->with('success', 'Skill berhasil ditambahkan.');
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'category'    => 'required|in:tech,hard,soft',
            'icon'        => 'nullable|string|max:100',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'sort_order'  => 'nullable|integer',
            'is_visible'  => 'nullable|boolean',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = false;
        }

        $skill->update($validated);

        return back()->with('success', 'Skill berhasil diperbarui.');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return back()->with('success', 'Skill berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'skills'   => 'required|array',
            'skills.*' => 'required|integer|exists:skills,id',
        ]);

        foreach ($request->skills as $index => $id) {
            Skill::where('id', $id)->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Urutan skill berhasil disimpan.');
    }
}
