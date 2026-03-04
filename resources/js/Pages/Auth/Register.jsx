import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, User, Mail, Lock, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '', nik: '', username: '', email: '',
        phone: '', password: '', password_confirmation: '',
    });

    const handleSubmit = e => { e.preventDefault(); post('/register'); };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex">

            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-700 to-indigo-500 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Pengaduan</p>
                        <p className="text-indigo-200 text-xs">Masyarakat</p>
                    </div>
                </div>

                {/* Text */}
                <div className="relative">
                    <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                        Bergabung &amp;<br />Suarakan Aspirasimu
                    </h2>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                        Daftarkan diri Anda untuk mulai menyampaikan pengaduan
                        dan memantau perkembangannya secara real-time.
                    </p>
                    <div className="space-y-3">
                        {[
                            'Laporan ditangani oleh petugas berpengalaman',
                            'Notifikasi real-time setiap update status',
                            'Komunikasi langsung dengan petugas',
                            'Riwayat pengaduan tersimpan aman',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                                <p className="text-indigo-100 text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-indigo-300 text-xs">
                    © {new Date().getFullYear()} Pengaduan Masyarakat.
                </p>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-lg">

                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Pengaduan Masyarakat</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Akun Baru</h1>
                        <p className="text-gray-500 text-sm">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>

                    <Head title="Daftar" />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Nama */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* NIK */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    NIK <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" value={data.nik}
                                        onChange={e => setData('nik', e.target.value.replace(/\D/g,'').slice(0,16))}
                                        placeholder="16 digit NIK" maxLength={16}
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.nik ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                                {errors.nik
                                    ? <p className="text-red-500 text-xs mt-1">{errors.nik}</p>
                                    : <p className="text-gray-400 text-xs mt-1">{data.nik.length}/16 digit</p>}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                    <input type="text" value={data.username}
                                        onChange={e => setData('username', e.target.value.toLowerCase().replace(/\s/g,''))}
                                        placeholder="username_unik"
                                        className={`w-full pl-8 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="email" value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@contoh.com"
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Telepon */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    No. Telepon <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" value={data.phone}
                                        onChange={e => setData('phone', e.target.value.replace(/\D/g,'').slice(0,13))}
                                        placeholder="08xxxxxxxxxx"
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type={showPassword ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Min. 8 karakter"
                                        className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Konfirmasi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Konfirmasi Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                        className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500
                                            ${data.password_confirmation && data.password !== data.password_confirmation ? 'border-red-300 bg-red-50'
                                            : data.password_confirmation && data.password === data.password_confirmation ? 'border-green-300 bg-green-50'
                                            : 'border-gray-200'}`} />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {data.password_confirmation && data.password !== data.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>
                                )}
                                {data.password_confirmation && data.password === data.password_confirmation && (
                                    <p className="text-green-500 text-xs mt-1">✓ Password cocok</p>
                                )}
                            </div>
                        </div>

                        {/* Password strength bar */}
                        {data.password && (
                            <div>
                                <div className="flex gap-1 mb-1">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                            data.password.length >= i * 2
                                                ? i<=1 ? 'bg-red-400' : i<=2 ? 'bg-yellow-400' : i<=3 ? 'bg-blue-400' : 'bg-green-400'
                                                : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400">
                                    Kekuatan: {data.password.length < 4 ? 'Terlalu pendek' : data.password.length < 6 ? 'Lemah' : data.password.length < 8 ? 'Sedang' : 'Kuat'}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-gray-400">
                            Dengan mendaftar, Anda menyetujui{' '}
                            <span className="text-indigo-600 cursor-pointer hover:underline">Syarat &amp; Ketentuan</span>
                            {' '}dan{' '}
                            <span className="text-indigo-600 cursor-pointer hover:underline">Kebijakan Privasi</span> kami.
                        </p>

                        <button type="submit" disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                    Mendaftarkan...
                                </>
                            ) : 'Daftar Sekarang'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Masuk</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}