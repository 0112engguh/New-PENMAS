<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_aduan', 'user_id', 'petugas_id', 'judul', 'kategori',
        'isi_laporan', 'lokasi', 'foto', 'status', 'is_verified',
        'is_valid', 'catatan_admin', 'rating', 'tanggal_pengaduan'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_valid' => 'boolean',
        'tanggal_pengaduan' => 'datetime',
    ];

    protected $appends = ['foto_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function tanggapans()
    {
        return $this->hasMany(Tanggapan::class);
    }

    public static function generateKode(): string
    {
        $prefix = 'ADU';
        $year = date('Y');
        $last = self::whereYear('created_at', $year)->count() + 1;
        return $prefix . $year . str_pad($last, 4, '0', STR_PAD_LEFT);
    }

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto ? asset('storage/' . $this->foto) : null;
    }

    public function getStatusBadgeAttribute(): array
    {
        return match($this->status) {
            'menunggu'  => ['label' => 'Menunggu',  'color' => 'yellow'],
            'diproses'  => ['label' => 'Diproses',  'color' => 'blue'],
            'selesai'   => ['label' => 'Selesai',   'color' => 'green'],
            'ditolak'   => ['label' => 'Ditolak',   'color' => 'red'],
            default     => ['label' => 'Unknown',   'color' => 'gray'],
        };
    }
}