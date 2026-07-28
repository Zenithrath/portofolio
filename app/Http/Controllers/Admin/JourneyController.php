<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JourneyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year'        => 'required|string|max:20',
            'title'       => 'required|string|max:200',
            'description' => 'required|string|max:1000',
            'type'        => 'required|in:education,work,achievement,organization',
            'institution' => 'nullable|string|max:200',
            'image'       => 'nullable|image|max:4096',
            'sort_order'  => 'nullable|integer',
            'is_visible'  => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('journeys', 'public');
        }

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = true;
        }
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        Journey::create($validated);

        return back()->with('success', 'Riwayat berhasil ditambahkan.');
    }

    public function update(Request $request, Journey $journey)
    {
        $validated = $request->validate([
            'year'        => 'required|string|max:20',
            'title'       => 'required|string|max:200',
            'description' => 'required|string|max:1000',
            'type'        => 'required|in:education,work,achievement,organization',
            'institution' => 'nullable|string|max:200',
            'image'       => 'nullable|image|max:4096',
            'sort_order'  => 'nullable|integer',
            'is_visible'  => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($journey->image) {
                Storage::disk('public')->delete($journey->image);
            }

            $validated['image'] = $request->file('image')->store('journeys', 'public');
        }

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = false;
        }

        $journey->update($validated);

        return back()->with('success', 'Riwayat berhasil diperbarui.');
    }

    public function destroy(Journey $journey)
    {
        $journey->delete();
        return back()->with('success', 'Riwayat berhasil dihapus.');
    }
}
