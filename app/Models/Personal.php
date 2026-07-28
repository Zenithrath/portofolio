<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Personal extends Model
{
    protected $fillable = [
        'name', 'title', 'university', 'faculty', 'bio', 'tagline',
        'photo', 'location', 'quote', 'cv_file', 'status'
    ];

    protected $appends = ['photo_url', 'cv_url'];

    public function getPhotoUrlAttribute()
    {
        return $this->photo ? Storage::url($this->photo) : null;
    }

    public function getCvUrlAttribute()
    {
        return $this->cv_file ? Storage::url($this->cv_file) : null;
    }
}
