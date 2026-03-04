<?php

namespace App\Policies;

use App\Models\Pengaduan;
use App\Models\User;

class PengaduanPolicy
{
    public function view(User $user, Pengaduan $pengaduan): bool
    {
        return $user->isAdmin()
            || $user->isPetugas()
            || $pengaduan->user_id === $user->id;
    }

    public function manage(User $user, Pengaduan $pengaduan): bool
    {
        return $user->isAdmin()
            || ($user->isPetugas() && $pengaduan->petugas_id === $user->id);
    }

    public function isAdmin(User $user): bool
    {
        return $user->isAdmin();
    }
}