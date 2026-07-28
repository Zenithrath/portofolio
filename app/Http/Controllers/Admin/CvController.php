<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CvController extends Controller
{
    public function update(Request $request)
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
