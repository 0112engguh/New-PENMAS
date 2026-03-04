<?php

namespace App\Http\Middleware;

use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'avatar_url' => $request->user()->avatar_url,
                ] : null,
            ],
            'notifikasi_count' => $request->user()
                ? Notifikasi::where('user_id', $request->user()->id)
                    ->where('is_read', false)->count()
                : 0,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }
}