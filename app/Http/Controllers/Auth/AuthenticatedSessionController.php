<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'supabase_access_token' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $supabaseUser = $this->verifySupabaseUser($request->string('supabase_access_token')->toString());
        $supabaseEmail = Str::lower((string) ($supabaseUser['email'] ?? ''));

        if ($supabaseEmail === '' || $supabaseEmail !== Str::lower($request->string('email')->toString())) {
            throw ValidationException::withMessages([
                'email' => 'Sesi Supabase tidak cocok dengan email yang dikirim.',
            ]);
        }

        $metadata = $supabaseUser['user_metadata'] ?? [];
        $name = $metadata['full_name']
            ?? $metadata['name']
            ?? Str::before($supabaseEmail, '@');

        $user = User::query()->firstOrNew(['email' => $supabaseEmail]);
        $user->forceFill([
            'name' => $user->exists ? $user->name : $name,
            'password' => $user->exists ? $user->password : Hash::make(Str::random(48)),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard.index', absolute: false));
    }

    /**
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    private function verifySupabaseUser(string $accessToken): array
    {
        $url = rtrim((string) config('services.supabase.url'), '/');
        $key = (string) (config('services.supabase.anon_key') ?: config('services.supabase.publishable_key'));

        if ($url === '' || $key === '') {
            throw ValidationException::withMessages([
                'email' => 'Konfigurasi Supabase belum lengkap.',
            ]);
        }

        $response = Http::withToken($accessToken)
            ->withHeaders(['apikey' => $key])
            ->acceptJson()
            ->get("{$url}/auth/v1/user");

        if (! $response->successful()) {
            throw ValidationException::withMessages([
                'email' => 'Sesi Supabase tidak valid. Silakan login ulang.',
            ]);
        }

        return $response->json();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
