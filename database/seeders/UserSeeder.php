<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Administrator',
            'username' => 'admin',
            'email'    => 'admin@pengaduan.id',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'status'   => 'aktif',
        ]);

        // Petugas
        User::create([
            'name'     => 'Petugas Satu',
            'username' => 'petugas1',
            'email'    => 'petugas1@pengaduan.id',
            'password' => Hash::make('password'),
            'phone'    => '081234567890',
            'role'     => 'petugas',
            'status'   => 'aktif',
        ]);

        // Masyarakat
        User::create([
            'name'     => 'Budi Santoso',
            'nik'      => '3201234567890001',
            'username' => 'budi',
            'email'    => 'budi@gmail.com',
            'password' => Hash::make('password'),
            'phone'    => '085678901234',
            'role'     => 'masyarakat',
            'status'   => 'aktif',
        ]);
    }
}