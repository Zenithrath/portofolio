<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    protected $fillable = [
        'title', 'category', 'description', 'thumbnail',
        'demo_url', 'repo_url', 'year', 'is_featured', 'is_visible', 'sort_order'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_visible' => 'boolean',
        'year' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = ['thumbnail_url'];

    public function tags()
    {
        return $this->hasMany(ProjectTag::class);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? Storage::url($this->thumbnail) : null;
    }
}
