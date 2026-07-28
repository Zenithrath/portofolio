<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform'   => 'required|string|max:50',
            'label'      => 'required|string|max:100',
            'value'      => 'required|string|max:500',
            'icon'       => 'nullable|string|max:50',
            'is_visible' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = true;
        }
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        Contact::create($validated);

        return back()->with('success', 'Kontak berhasil ditambahkan.');
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'platform'   => 'required|string|max:50',
            'label'      => 'required|string|max:100',
            'value'      => 'required|string|max:500',
            'icon'       => 'nullable|string|max:50',
            'is_visible' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = false;
        }

        $contact->update($validated);

        return back()->with('success', 'Kontak berhasil diperbarui.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return back()->with('success', 'Kontak berhasil dihapus.');
    }
}
