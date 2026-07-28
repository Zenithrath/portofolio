<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('platform');   // 'email' | 'linkedin' | 'github' | 'whatsapp' | 'instagram'
            $table->string('label');      // teks yang ditampilkan
            $table->string('value');      // URL atau value (email address, nomor WA, dll)
            $table->string('icon')->nullable();  // nama lucide icon
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
