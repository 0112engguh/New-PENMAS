<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Pengaduan;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PengaduanController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Pengaduan::with(['user', 'petugas']);

        if ($user->isMasyarakat()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isPetugas()) {
            $query->where(function ($q) use ($user) {
                $q->where('petugas_id', $user->id)
                  ->orWhere('status', 'menunggu');
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', "%{$request->search}%")
                  ->orWhere('kode_aduan', 'like', "%{$request->search}%");
            });
        }

        $pengaduans = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Pengaduan/Index', [
            'pengaduans' => $pengaduans,
            'filters'    => $request->only('status', 'kategori', 'search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pengaduan/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'       => 'required|string|max:100',
            'kategori'    => 'required|in:infrastruktur,pelayanan,keamanan,lingkungan,lainnya',
            'isi_laporan' => 'required|string|min:20',
            'lokasi'      => 'nullable|string|max:255',
            'foto'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('pengaduan', 'public');
        }

        $pengaduan = Pengaduan::create([
            'kode_aduan'       => Pengaduan::generateKode(),
            'user_id'          => auth()->id(),
            'judul'            => $request->judul,
            'kategori'         => $request->kategori,
            'isi_laporan'      => $request->isi_laporan,
            'lokasi'           => $request->lokasi,
            'foto'             => $fotoPath,
            'tanggal_pengaduan'=> now(),
        ]);

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notifikasi::create([
                'user_id' => $admin->id,
                'judul'   => 'Pengaduan Baru',
                'pesan'   => "Pengaduan baru dari {$pengaduan->user->name}: {$pengaduan->judul}",
                'link'    => route('pengaduan.show', $pengaduan->id),
            ]);
        }

        return redirect()->route('pengaduan.show', $pengaduan->id)
            ->with('success', 'Pengaduan berhasil dikirim! Kode: ' . $pengaduan->kode_aduan);
    }

    public function show(Pengaduan $pengaduan)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !$user->isPetugas() && $pengaduan->user_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        $pengaduan->load(['user', 'petugas', 'tanggapans.user']);

        $petugasList = [];
        if (auth()->user()->isAdmin()) {
            $petugasList = User::where('role', 'petugas')->where('status', 'aktif')->get();
        }

        return Inertia::render('Pengaduan/Show', [
            'pengaduan'   => $pengaduan,
            'petugasList' => $petugasList,
        ]);
    }

    use AuthorizesRequests;
    public function verifikasi(Request $request, Pengaduan $pengaduan)
    {
        $this->authorize('manage', $pengaduan);

        $request->validate([
            'is_verified'   => 'required|boolean',
            'is_valid'      => 'required|boolean',
            'catatan_admin' => 'nullable|string',
            'petugas_id'    => 'nullable|exists:users,id',
        ]);

        $status = 'menunggu';
        if ($request->is_verified && $request->is_valid) {
            $status = $request->petugas_id ? 'diproses' : 'menunggu';
        } elseif ($request->is_verified && !$request->is_valid) {
            $status = 'ditolak';
        }

        $pengaduan->update([
            'is_verified'   => $request->is_verified,
            'is_valid'      => $request->is_valid,
            'catatan_admin' => $request->catatan_admin,
            'petugas_id'    => $request->petugas_id,
            'status'        => $status,
        ]);

        Notifikasi::create([
            'user_id' => $pengaduan->user_id,
            'judul'   => 'Status Pengaduan Diperbarui',
            'pesan'   => "Pengaduan Anda ({$pengaduan->kode_aduan}) telah {$status}.",
            'link'    => route('pengaduan.show', $pengaduan->id),
        ]);

        return back()->with('success', 'Verifikasi berhasil disimpan.');
    }

    public function updateStatus(Request $request, Pengaduan $pengaduan)
    {
        $request->validate(['status' => 'required|in:diproses,selesai']);

        $pengaduan->update(['status' => $request->status]);

        Notifikasi::create([
            'user_id' => $pengaduan->user_id,
            'judul'   => 'Pengaduan Diperbarui',
            'pesan'   => "Status pengaduan Anda ({$pengaduan->kode_aduan}) sekarang: {$request->status}.",
        ]);

        return back()->with('success', 'Status berhasil diperbarui.');
    }

    public function laporan(Request $request)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !$user->isPetugas() && $pengaduan->user_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        $query = Pengaduan::with('user');

        if ($request->bulan) $query->whereMonth('created_at', $request->bulan);
        if ($request->tahun) $query->whereYear('created_at', $request->tahun);
        if ($request->status) $query->where('status', $request->status);

        $data = [
            'pengaduans'   => $query->get(),
            'summary'      => [
                'total'    => $query->count(),
                'selesai'  => (clone $query)->where('status', 'selesai')->count(),
                'ditolak'  => (clone $query)->where('status', 'ditolak')->count(),
                'diproses' => (clone $query)->where('status', 'diproses')->count(),
            ],
        ];

        return Inertia::render('Admin/Laporan', $data);
    }
}