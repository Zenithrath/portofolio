<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Certificate extends Model
{
    protected $fillable = [
        'title', 'issuer', 'credential_id', 'credential_url', 'image', 'year', 'is_visible', 'sort_order'
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'year' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }
}
