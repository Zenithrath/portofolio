<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name', 'category', 'icon', 'proficiency', 'sort_order', 'is_visible'
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'proficiency' => 'integer',
        'sort_order' => 'integer',
    ];
}
