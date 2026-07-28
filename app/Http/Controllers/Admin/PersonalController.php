<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonalController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:100',
            'title'      => 'required|string|max:100',
            'university' => 'required|string|max:150',
            'faculty'    => 'required|string|max:150',
            'bio'        => 'required|string|max:1000',
            'tagline'    => 'required|string|max:200',
            'location'   => 'required|string|max:200',
            'quote'      => 'required|string|max:500',
            'status'     => 'required|string|max:50',
        ]);

        $personal = Personal::firstOrCreate([], [
            'name' => '', 'title' => '', 'university' => '', 'faculty' => '',
            'bio' => '', 'tagline' => '', 'location' => '', 'quote' => '', 'status' => ''
        ]);
        $personal->update($validated);

        return back()->with('success', 'Informasi personal berhasil diperbarui.');
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        $personal = Personal::firstOrCreate([], [
            'name' => '', 'title' => '', 'university' => '', 'faculty' => '',
            'bio' => '', 'tagline' => '', 'location' => '', 'quote' => '', 'status' => ''
        ]);

        if ($personal->photo) {
            Storage::disk('public')->delete($personal->photo);
        }

        $path = $request->file('photo')->store('profile', 'public');
        $personal->update(['photo' => $path]);

        return back()->with('success', 'Foto profil berhasil diperbarui.');
    }

    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf|max:10240'
        ]);

        $personal = Personal::firstOrCreate([], [
            'name' => '', 'title' => '', 'university' => '', 'faculty' => '',
            'bio' => '', 'tagline' => '', 'location' => '', 'quote' => '', 'status' => ''
        ]);

        if ($personal->cv_file) {
            Storage::disk('public')->delete($personal->cv_file);
        }

        $path = $request->file('cv_file')->store('cv', 'public');
        $personal->update(['cv_file' => $path]);

        return back()->with('success', 'File CV berhasil diperbarui.');
    }
}
