<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $notifikasis = Notifikasi::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        Notifikasi::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return Inertia::render('Notifikasi/Index', [
            'notifikasis' => $notifikasis,
        ]);
    }

    public function markRead(Notifikasi $notifikasi)
    {
        if ($notifikasi->user_id !== auth()->id()) {
            abort(403);
        }

        $notifikasi->update(['is_read' => true]);

        return back();
    }

    public function readAll()
    {
        Notifikasi::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back()->with('success', 'Semua notifikasi telah dibaca.');
    }
}