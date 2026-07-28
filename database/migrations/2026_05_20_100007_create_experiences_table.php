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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->string('type')->default('internship'); // 'fulltime' | 'parttime' | 'internship' | 'freelance' | 'organization'
            $table->date('start_date');
            $table->date('end_date')->nullable();   // null = masih berlangsung
            $table->boolean('is_current')->default(false);
            $table->text('description');
            $table->string('location')->nullable();
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
        Schema::dropIfExists('experiences');
    }
};
