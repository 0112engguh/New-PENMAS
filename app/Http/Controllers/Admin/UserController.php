<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller     
{
    use AuthorizesRequests;
    
    public function index(Request $request)
    {
        $users = User::when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%");
            })
            ->when($request->role, fn ($q) => $q->where('role', $request->role))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only('search', 'role'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:25|unique:users',
            'email'    => 'required|email|unique:users',
            'phone'    => 'nullable|string|max:13',
            'role'     => 'required|in:admin,petugas,masyarakat',
            'password' => 'required|min:8',
        ]);

        User::create([
            ...$request->only('name', 'username', 'email', 'phone', 'role'),
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'status' => 'required|in:aktif,nonaktif',
            'role'   => 'required|in:admin,petugas,masyarakat',
        ]);

        $user->update($request->only('name', 'status', 'role'));

        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}