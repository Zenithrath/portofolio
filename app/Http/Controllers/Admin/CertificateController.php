<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:200',
            'issuer'         => 'required|string|max:200',
            'credential_id'  => 'nullable|string|max:100',
            'credential_url' => 'nullable|url',
            'year'           => 'required|integer',
            'is_visible'     => 'nullable|boolean',
            'sort_order'     => 'nullable|integer',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = true;
        }
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        Certificate::create($validated);

        return back()->with('success', 'Sertifikat berhasil ditambahkan.');
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:200',
            'issuer'         => 'required|string|max:200',
            'credential_id'  => 'nullable|string|max:100',
            'credential_url' => 'nullable|url',
            'year'           => 'required|integer',
            'is_visible'     => 'nullable|boolean',
            'sort_order'     => 'nullable|integer',
        ]);

        if (!isset($validated['is_visible'])) {
            $validated['is_visible'] = false;
        }

        $certificate->update($validated);

        return back()->with('success', 'Sertifikat berhasil diperbarui.');
    }

    public function destroy(Certificate $certificate)
    {
        if ($certificate->image) {
            Storage::disk('public')->delete($certificate->image);
        }
        $certificate->delete();
        return back()->with('success', 'Sertifikat berhasil dihapus.');
    }

    public function uploadImage(Request $request, Certificate $certificate)
    {
        $request->validate([
            'image' => 'required|image|max:2048'
        ]);

        if ($certificate->image) {
            Storage::disk('public')->delete($certificate->image);
        }

        $path = $request->file('image')->store('certificates', 'public');
        $certificate->update(['image' => $path]);

        return back()->with('success', 'Gambar sertifikat berhasil diperbarui.');
    }
}
