import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function Login({ canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const [showPassword, setShowPassword] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        post(route('login'))
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-black to-slate-950 relative overflow-hidden">

            <Head title="Login" />

            <div className="absolute w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
            <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl bottom-[-150px] right-[-150px]"></div>

            <div className="relative w-full h-screen flex">

                <div className="
                    relative z-20
                    w-full md:w-1/2
                    p-12
                    md:-mr-16
                    bg-white/10
                    backdrop-blur-2xl
                    border border-white/20
                    shadow-2xl
                    rounded-e-3xl
                ">

                    <div className="mt-20 max-w-md mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Masuk ke PENMAS
                            </h2>
                            <p className="text-white/60 text-sm">
                                Sistem Pengaduan Masyarakat
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">

                            {/* Email */}
                            <div>
                                <label className="text-white/70 text-sm">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-white/70 text-sm">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    placeholder="Masukkan password"
                                />

                                <div className="flex justify-between mt-2 text-sm text-white/60">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hover:text-white transition"
                                    >
                                        {showPassword ? "Sembunyikan" : "Lihat Password"}
                                    </button>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="hover:text-white transition"
                                        >
                                            Lupa Password?
                                        </Link>
                                    )}
                                </div>

                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="accent-indigo-500"
                                />
                                Ingat Saya
                            </div>

                            {/* Button */}
                            <button
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-[1.03] transition transform text-white font-semibold shadow-lg disabled:opacity-50"
                            >
                                {processing ? "Memproses..." : "Masuk"}
                            </button>

                        </form>

                        <div className="mt-6 text-sm text-white/60">
                            Belum punya akun?{" "}
                            <Link
                                href={route('register')}
                                className="text-indigo-400 hover:text-white font-medium transition"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="
                    relative z-10
                    hidden md:flex
                    w-10/12
                    items-center justify-center
                    bg-gradient-to-br from-indigo-700 to-blue-900
                    rounded-s-3xl
                ">

                    <div className="text-white text-center px-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Transparansi & Pelayanan
                        </h2>
                        <p className="text-white/80">
                            Kelola laporan masyarakat dengan cepat,
                            efisien, dan terpercaya.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}