import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    User, Mail, Phone, CreditCard, Lock,
    Camera, Save, Eye, EyeOff, CheckCircle,
    AlertCircle, Shield, Bell, Trash2
} from 'lucide-react';

// ── Reusable Components ───────────────────────────────

function SectionCard({ title, subtitle, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function FormField({ label, error, hint, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                    <AlertCircle className="w-3 h-3" />{error}
                </p>
            )}
            {hint && !error && (
                <p className="text-xs text-gray-400 mt-1.5">{hint}</p>
            )}
        </div>
    );
}

function Input({ error, ...props }) {
    return (
        <input
            {...props}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all
                ${error
                    ? 'border-red-200 bg-red-50 focus:ring-red-100'
                    : 'border-gray-100 bg-gray-50 focus:ring-black/10 focus:border-gray-300'
                }`}
        />
    );
}

function PasswordInput({ value, onChange, placeholder, error }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-3.5 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all
                    ${error
                        ? 'border-red-200 bg-red-50 focus:ring-red-100'
                        : 'border-gray-100 bg-gray-50 focus:ring-black/10 focus:border-gray-300'
                    }`}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

function SaveButton({ loading, label = 'Simpan Perubahan' }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Save className="w-4 h-4" />
            )}
            {loading ? 'Menyimpan...' : label}
        </button>
    );
}

function Toast({ message, type = 'success' }) {
    if (!message) return null;
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-medium transition-all
            ${type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
            {type === 'success'
                ? <CheckCircle className="w-4 h-4 text-green-400" />
                : <AlertCircle className="w-4 h-4" />
            }
            {message}
        </div>
    );
}

// ── Main Profile Page ─────────────────────────────────
export default function ProfilePage({ user: propUser, stats }) {
    const { auth, flash } = usePage().props;
    const currentUser = propUser ?? auth.user;

    // ── Info form state
    const [info, setInfo]         = useState({
        name:     currentUser?.name     ?? '',
        email:    currentUser?.email    ?? '',
        phone:    currentUser?.phone    ?? '',
        nik:      currentUser?.nik      ?? '',
        username: currentUser?.username ?? '',
    });
    const [infoErrors,  setInfoErrors]  = useState({});
    const [infoLoading, setInfoLoading] = useState(false);

    // ── Password form state
    const [pass, setPass]           = useState({ current: '', new: '', confirm: '' });
    const [passErrors, setPassErrors] = useState({});
    const [passLoading, setPassLoading] = useState(false);

    // ── Avatar state
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile,    setAvatarFile]    = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const avatarRef = useRef();

    // ── Toast state
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
    };

    const ROLE_STYLE = {
        admin:      { bg: 'bg-rose-50',   text: 'text-rose-600',   label: 'Administrator' },
        petugas:    { bg: 'bg-blue-50',   text: 'text-blue-600',   label: 'Petugas'       },
        masyarakat: { bg: 'bg-green-50',  text: 'text-green-600',  label: 'Masyarakat'    },
    };
    const roleStyle = ROLE_STYLE[currentUser?.role] ?? ROLE_STYLE.masyarakat;

    // ── Handlers ─────────────────────────────────────

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarUpload = () => {
        if (!avatarFile) return;
        setAvatarLoading(true);
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        router.post('/profile/avatar', fd, {
            forceFormData: true,
            onSuccess: () => { showToast('Foto profil berhasil diperbarui'); setAvatarLoading(false); },
            onError:   () => { showToast('Gagal mengunggah foto', 'error'); setAvatarLoading(false); },
        });
    };

    const handleInfoSubmit = e => {
        e.preventDefault();
        setInfoLoading(true);
        setInfoErrors({});
        router.patch('/profile', info, {
            onSuccess: () => { showToast('Profil berhasil diperbarui'); setInfoLoading(false); },
            onError:   (errors) => { setInfoErrors(errors); setInfoLoading(false); },
        });
    };

    const handlePassSubmit = e => {
        e.preventDefault();
        setPassErrors({});

        if (pass.new !== pass.confirm) {
            setPassErrors({ confirm: 'Konfirmasi password tidak cocok' });
            return;
        }
        if (pass.new.length < 8) {
            setPassErrors({ new: 'Password minimal 8 karakter' });
            return;
        }

        setPassLoading(true);
        router.patch('/profile/password', {
            current_password:      pass.current,
            password:              pass.new,
            password_confirmation: pass.confirm,
        }, {
            onSuccess: () => {
                showToast('Password berhasil diubah');
                setPass({ current: '', new: '', confirm: '' });
                setPassLoading(false);
            },
            onError: (errors) => { setPassErrors(errors); setPassLoading(false); },
        });
    };

    const handleDeleteAccount = () => {
        if (!confirm('Yakin ingin menghapus akun? Semua data akan hilang permanen.')) return;
        router.delete('/profile', {
            onSuccess: () => router.visit('/'),
        });
    };

    // ── Password strength
    const passStrength = () => {
        const p = pass.new;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8)  score++;
        if (p.length >= 12) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return Math.min(score, 4);
    };

    const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

    return (
        <AppLayout title="Profil Saya">
            <Head title="Profil Saya" />
            <Toast message={toast.message} type={toast.type} />

            <div className="max-w-2xl mx-auto space-y-5">

                {/* ── Avatar & Identity Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Cover */}
                    <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-50" />

                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end justify-between -mt-12 mb-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-black flex items-center justify-center">
                                    {avatarPreview || currentUser?.avatar_url ? (
                                        <img
                                            src={avatarPreview ?? currentUser.avatar_url}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-2xl font-bold">
                                            {currentUser?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Camera button */}
                                <button
                                    onClick={() => avatarRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-black hover:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm transition-colors"
                                >
                                    <Camera className="w-3.5 h-3.5 text-white" />
                                </button>
                                <input ref={avatarRef} type="file" accept="image/*"
                                    onChange={handleAvatarChange} className="hidden" />
                            </div>

                            {/* Upload button (muncul setelah pilih foto) */}
                            {avatarFile && (
                                <button
                                    onClick={handleAvatarUpload}
                                    disabled={avatarLoading}
                                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                    {avatarLoading
                                        ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <Save className="w-3.5 h-3.5" />
                                    }
                                    Simpan Foto
                                </button>
                            )}
                        </div>

                        {/* Name & role */}
                        <h2 className="text-lg font-bold text-gray-900 mb-1">{currentUser?.name}</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleStyle.bg} ${roleStyle.text}`}>
                                {roleStyle.label}
                            </span>
                            {currentUser?.username && (
                                <span className="text-xs text-gray-400">@{currentUser.username}</span>
                            )}
                        </div>

                        {/* Stats (untuk masyarakat) */}
                        {stats && (
                            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-50">
                                {[
                                    { label: 'Total Laporan', value: stats.total    ?? 0 },
                                    { label: 'Diproses',      value: stats.diproses ?? 0 },
                                    { label: 'Selesai',       value: stats.selesai  ?? 0 },
                                ].map(s => (
                                    <div key={s.label} className="text-center">
                                        <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Info Pribadi ── */}
                <SectionCard title="Informasi Pribadi" subtitle="Perbarui data diri Anda" icon={User}>
                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Nama Lengkap" error={infoErrors.name}>
                                <Input
                                    type="text"
                                    value={info.name}
                                    onChange={e => setInfo({ ...info, name: e.target.value })}
                                    placeholder="Nama lengkap"
                                    error={infoErrors.name}
                                />
                            </FormField>

                            <FormField label="Username" error={infoErrors.username}>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                    <input
                                        type="text"
                                        value={info.username}
                                        onChange={e => setInfo({ ...info, username: e.target.value.toLowerCase().replace(/\s/g,'') })}
                                        placeholder="username"
                                        className={`w-full pl-8 pr-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all
                                            ${infoErrors.username ? 'border-red-200 bg-red-50 focus:ring-red-100' : 'border-gray-100 bg-gray-50 focus:ring-black/10'}`}
                                    />
                                </div>
                                {infoErrors.username && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{infoErrors.username}</p>}
                            </FormField>

                            <FormField label="Email" error={infoErrors.email}>
                                <Input
                                    type="email"
                                    value={info.email}
                                    onChange={e => setInfo({ ...info, email: e.target.value })}
                                    placeholder="email@contoh.com"
                                    error={infoErrors.email}
                                />
                            </FormField>

                            <FormField label="No. Telepon" error={infoErrors.phone}>
                                <Input
                                    type="text"
                                    value={info.phone ?? ''}
                                    onChange={e => setInfo({ ...info, phone: e.target.value.replace(/\D/g,'').slice(0,13) })}
                                    placeholder="08xxxxxxxxxx"
                                    error={infoErrors.phone}
                                />
                            </FormField>

                            <FormField label="NIK" error={infoErrors.nik}
                                hint={`${(info.nik ?? '').length}/16 digit`}>
                                <Input
                                    type="text"
                                    value={info.nik ?? ''}
                                    onChange={e => setInfo({ ...info, nik: e.target.value.replace(/\D/g,'').slice(0,16) })}
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    error={infoErrors.nik}
                                />
                            </FormField>
                        </div>

                        <div className="flex justify-end pt-2">
                            <SaveButton loading={infoLoading} />
                        </div>
                    </form>
                </SectionCard>

                {/* ── Keamanan / Password ── */}
                <SectionCard title="Keamanan" subtitle="Ubah password akun Anda" icon={Lock}>
                    <form onSubmit={handlePassSubmit} className="space-y-4">
                        <FormField label="Password Saat Ini" error={passErrors.current_password}>
                            <PasswordInput
                                value={pass.current}
                                onChange={e => setPass({ ...pass, current: e.target.value })}
                                placeholder="Masukkan password saat ini"
                                error={passErrors.current_password}
                            />
                            {passErrors.current_password && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3"/>{passErrors.current_password}
                                </p>
                            )}
                        </FormField>

                        <FormField label="Password Baru" error={passErrors.new}>
                            <PasswordInput
                                value={pass.new}
                                onChange={e => setPass({ ...pass, new: e.target.value })}
                                placeholder="Min. 8 karakter"
                                error={passErrors.new}
                            />
                            {passErrors.new && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3"/>{passErrors.new}
                                </p>
                            )}
                            {/* Password strength */}
                            {pass.new && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passStrength() ? strengthColor[passStrength()] : 'bg-gray-100'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Kekuatan: <span className="font-medium">{strengthLabel[passStrength()]}</span>
                                    </p>
                                </div>
                            )}
                        </FormField>

                        <FormField label="Konfirmasi Password Baru" error={passErrors.confirm}>
                            <PasswordInput
                                value={pass.confirm}
                                onChange={e => setPass({ ...pass, confirm: e.target.value })}
                                placeholder="Ulangi password baru"
                                error={passErrors.confirm}
                            />
                            {passErrors.confirm && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3"/>{passErrors.confirm}
                                </p>
                            )}
                            {pass.confirm && pass.new === pass.confirm && (
                                <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3"/> Password cocok
                                </p>
                            )}
                        </FormField>

                        <div className="flex justify-end pt-2">
                            <SaveButton loading={passLoading} label="Ubah Password" />
                        </div>
                    </form>
                </SectionCard>

                {/* ── Danger zone ── */}
                <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-50 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Zona Berbahaya</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Hapus Akun</p>
                            <p className="text-xs text-gray-400">Semua data pengaduan dan riwayat akan dihapus permanen.</p>
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ml-4"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Akun
                        </button>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}