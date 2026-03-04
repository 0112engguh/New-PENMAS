<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use App\Models\Tanggapan;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TanggapanController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Pengaduan $pengaduan)
    {
        $request->validate([
            'tanggapan' => 'required|string|min:5',
            'lampiran'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $user = auth()->user();
        $lampiranPath = null;

        if ($request->hasFile('lampiran')) {
            $lampiranPath = $request->file('lampiran')->store('tanggapan', 'public');
        }

        Tanggapan::create([
            'pengaduan_id' => $pengaduan->id,
            'user_id'      => $user->id,
            'tanggapan'    => $request->tanggapan,
            'tipe'         => $user->role,
            'lampiran'     => $lampiranPath,
        ]);

        if ($user->id !== $pengaduan->user_id) {
            Notifikasi::create([
                'user_id' => $pengaduan->user_id,
                'judul'   => 'Tanggapan Baru',
                'pesan'   => "Ada tanggapan baru pada pengaduan Anda: {$pengaduan->judul}",
                'link'    => route('pengaduan.show', $pengaduan->id),
            ]);
        }

        return back()->with('success', 'Tanggapan berhasil dikirim.');
    }
}