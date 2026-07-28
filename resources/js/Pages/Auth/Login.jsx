import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { supabaseBrowser } from '@/lib/supabase';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { supabase } = usePage().props;
    const [supabaseError, setSupabaseError] = useState('');
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        email: '',
        password: '',
        remember: false,
        supabase_access_token: '',
    });

    const submit = async (e) => {
        e.preventDefault();
        setSupabaseError('');

        const client = supabaseBrowser(supabase);
        if (!client) {
            setSupabaseError('Konfigurasi Supabase belum lengkap.');
            return;
        }

        const { data: authData, error } = await client.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error || !authData.session?.access_token) {
            const message = error?.message || 'Login Supabase gagal.';
            setSupabaseError(
                /invalid api key/i.test(message)
                    ? 'Supabase API key di .env tidak valid untuk project ini.'
                    : message,
            );
            reset('password');
            return;
        }

        transform((formData) => ({
            ...formData,
            supabase_access_token: authData.session.access_token,
        }));
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                    <InputError message={supabaseError} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
