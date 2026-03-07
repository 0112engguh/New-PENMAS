<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function edit()
    {
        $user  = auth()->user();
        $stats = null;

        if ($user->role === 'masyarakat') {
            $stats = [
                'total'    => $user->pengaduans()->count(),
                'diproses' => $user->pengaduans()->where('status','diproses')->count(),
                'selesai'  => $user->pengaduans()->where('status','selesai')->count(),
            ];
        }

        return inertia('Profile', compact('stats'));
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required','email', Rule::unique('users','email')->ignore($user->id)],
            'username' => ['nullable','string','max:50', Rule::unique('users','username')->ignore($user->id)],
            'phone'    => 'nullable|string|max:15',
            'nik'      => ['nullable','digits:16', Rule::unique('users','nik')->ignore($user->id)],
        ]);

        $user->update($request->only('name','email','username','phone','nik'));

        return back()->with('success', 'Profil berhasil diperbarui');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Password saat ini salah']);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password berhasil diubah');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048']);

        $user = auth()->user();
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Foto profil berhasil diperbarui');
    }

    public function destroy()
    {
        $user = auth()->user();
        auth()->logout();
        $user->delete();
        return redirect('/');
    }
}