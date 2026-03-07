<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pengaduan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DashboardController extends Controller
{
    use AuthorizesRequests;
    
    public function index(): Response
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        } elseif ($user->isPetugas()) {
            return $this->petugasDashboard();
        } else {
            return $this->masyarakatDashboard();
        }
    }

    private function adminDashboard(): Response
    {
        $stats = [
            'total_pengaduan' => Pengaduan::count(),
            'menunggu'        => Pengaduan::where('status', 'menunggu')->count(),
            'diproses'        => Pengaduan::where('status', 'diproses')->count(),
            'selesai'         => Pengaduan::where('status', 'selesai')->count(),
            'ditolak'         => Pengaduan::where('status', 'ditolak')->count(),
            'total_pengguna'  => User::where('role', 'masyarakat')->count(),
            'total_petugas'   => User::where('role', 'petugas')->count(),
        ];

        $recentPengaduan = Pengaduan::with('user')
            ->latest()
            ->take(10)
            ->get();

        $chartData = Pengaduan::selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as bulan,
                COUNT(*) as total,
                SUM(status = "selesai") as selesai
            ')
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->take(6)
            ->get();

        return Inertia::render('Dashboard/Admin', compact('stats', 'recentPengaduan', 'chartData'));
    }

    private function petugasDashboard(): Response
    {
        $user = auth()->user();

        $stats = [
            'ditugaskan' => Pengaduan::where('petugas_id', $user->id)->count(),
            'diproses'   => Pengaduan::where('petugas_id', $user->id)->where('status', 'diproses')->count(),
            'selesai'    => Pengaduan::where('petugas_id', $user->id)->where('status', 'selesai')->count(),
        ];

        $tugasSaya = Pengaduan::with('user')
            ->where('petugas_id', $user->id)
            ->whereIn('status', ['diproses'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard/Petugas', compact('stats', 'tugasSaya'));
    }

    private function masyarakatDashboard(): Response
    {
        $user = auth()->user();

        $stats = [
            'total'    => Pengaduan::where('user_id', $user->id)->count(),
            'menunggu' => Pengaduan::where('user_id', $user->id)->where('status', 'menunggu')->count(),
            'diproses' => Pengaduan::where('user_id', $user->id)->where('status', 'diproses')->count(),
            'selesai'  => Pengaduan::where('user_id', $user->id)->where('status', 'selesai')->count(),
        ];

        $recentPengaduan = $user->pengaduans()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Masyarakat', compact('stats', 'recentPengaduan'));
    }
}