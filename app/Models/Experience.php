<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company', 'position', 'type', 'start_date', 'end_date', 'is_current', 'description', 'location', 'is_visible', 'sort_order'
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'is_visible' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'sort_order' => 'integer',
    ];
}
