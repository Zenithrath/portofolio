<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();
        config([
            'services.supabase.url' => 'https://example.supabase.co',
            'services.supabase.anon_key' => 'test-anon-key',
        ]);
        Http::fake([
            'https://example.supabase.co/auth/v1/user' => Http::response([
                'email' => $user->email,
                'user_metadata' => ['name' => $user->name],
                'email_confirmed_at' => now()->toIso8601String(),
            ]),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'supabase_access_token' => 'valid-token',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard.index', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_supabase_token(): void
    {
        $user = User::factory()->create();
        config([
            'services.supabase.url' => 'https://example.supabase.co',
            'services.supabase.anon_key' => 'test-anon-key',
        ]);
        Http::fake([
            'https://example.supabase.co/auth/v1/user' => Http::response([], 401),
        ]);

        $this->post('/login', [
            'email' => $user->email,
            'supabase_access_token' => 'invalid-token',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
