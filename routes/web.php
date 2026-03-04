<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\TanggapanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfileController;

Route::get('/', fn() => inertia('Welcome'))->name('home');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::resource('pengaduan', PengaduanController::class)->except(['edit', 'update', 'destroy']);

    Route::post('pengaduan/{pengaduan}/tanggapan', [TanggapanController::class, 'store'])
        ->name('tanggapan.store');

    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::post('/notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markRead'])->name('notifikasi.read');
    Route::post('/notifikasi/read-all', [NotifikasiController::class, 'readAll'])->name('notifikasi.readAll');
    Route::delete('tanggapan/{tanggapan}', [TanggapanController::class, 'destroy'])->name('tanggapan.destroy');

    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('pengaduan/{pengaduan}/verifikasi', [PengaduanController::class, 'verifikasi'])
            ->name('pengaduan.verifikasi');
        Route::post('pengaduan/{pengaduan}/status', [PengaduanController::class, 'updateStatus'])
            ->name('pengaduan.status');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::get('laporan', [PengaduanController::class, 'laporan'])->name('laporan');
    });
});

require __DIR__.'/auth.php';