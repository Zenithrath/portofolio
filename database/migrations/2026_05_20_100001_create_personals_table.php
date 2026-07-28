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
        Schema::create('personals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');           // e.g. "D3 Teknologi Informasi"
            $table->string('university');
            $table->string('faculty');
            $table->text('bio');               // deskripsi singkat
            $table->string('tagline');         // 1 kalimat keren
            $table->string('photo')->nullable(); // path storage
            $table->string('location');        // domisili
            $table->string('quote');           // quote hidup
            $table->string('cv_file')->nullable(); // path PDF
            $table->string('status')->default('Open to Work'); // badge hero
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personals');
    }
};
