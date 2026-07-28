<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'quote' => 'required|string|max:500'
        ]);

        $personal = Personal::firstOrCreate([], [
            'name' => '', 'title' => '', 'university' => '', 'faculty' => '',
            'bio' => '', 'tagline' => '', 'location' => '', 'quote' => '', 'status' => ''
        ]);

        $personal->update([
            'quote' => $request->quote
        ]);

        return back()->with('success', 'Quote berhasil diperbarui.');
    }
}
