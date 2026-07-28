<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\CvController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\JourneyController;
use App\Http\Controllers\Admin\PersonalController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\QuoteController;
use App\Http\Controllers\Admin\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
Route::redirect('/home', '/');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::put('/personal', [PersonalController::class, 'update'])->name('personal.update');
    Route::post('/personal/photo', [PersonalController::class, 'uploadPhoto'])->name('personal.photo');
    Route::post('/personal/cv', [PersonalController::class, 'uploadCv'])->name('personal.cv');

    Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::put('/skills/{skill}', [SkillController::class, 'update'])->name('skills.update');
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');
    Route::post('/skills/reorder', [SkillController::class, 'reorder'])->name('skills.reorder');

    Route::post('/journey', [JourneyController::class, 'store'])->name('journey.store');
    Route::put('/journey/{journey}', [JourneyController::class, 'update'])->name('journey.update');
    Route::delete('/journey/{journey}', [JourneyController::class, 'destroy'])->name('journey.destroy');

    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('/projects/{project}/thumbnail', [ProjectController::class, 'uploadThumbnail'])->name('projects.thumbnail');

    Route::post('/certificates', [CertificateController::class, 'store'])->name('certificates.store');
    Route::put('/certificates/{certificate}', [CertificateController::class, 'update'])->name('certificates.update');
    Route::delete('/certificates/{certificate}', [CertificateController::class, 'destroy'])->name('certificates.destroy');
    Route::post('/certificates/{certificate}/image', [CertificateController::class, 'uploadImage'])->name('certificates.image');

    Route::post('/experience', [ExperienceController::class, 'store'])->name('experience.store');
    Route::put('/experience/{experience}', [ExperienceController::class, 'update'])->name('experience.update');
    Route::delete('/experience/{experience}', [ExperienceController::class, 'destroy'])->name('experience.destroy');

    Route::put('/quote', [QuoteController::class, 'update'])->name('quote.update');

    Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');
    Route::put('/contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');

    Route::post('/cv', [CvController::class, 'update'])->name('cv.update');
});

require __DIR__.'/auth.php';
