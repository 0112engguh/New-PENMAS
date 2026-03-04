<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'nik', 'username', 'email', 'password',
        'phone', 'address', 'role', 'status', 'avatar'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function pengaduans()
    {
        return $this->hasMany(Pengaduan::class);
    }

    public function tanggapans()
    {
        return $this->hasMany(Tanggapan::class);
    }

    public function tugasPengaduan()
    {
        return $this->hasMany(Pengaduan::class, 'petugas_id');
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class);
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    public function isMasyarakat(): bool
    {
        return $this->role === 'masyarakat';
    }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar
            ? asset('storage/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=6366f1&color=fff';
    }
}