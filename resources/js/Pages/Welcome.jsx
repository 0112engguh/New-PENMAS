import { Link } from '@inertiajs/react';
import { ClipboardList, Shield, Users, CheckCircle, ArrowRight, MessageSquare, Bell } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">Pengaduan</p>
                            <p className="text-xs text-gray-400 leading-tight">Masyarakat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    Layanan Pengaduan Digital
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Suarakan Aspirasi
                    <span className="text-indigo-600 block">Anda Kepada Kami</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Platform pengaduan masyarakat yang transparan, cepat, dan dapat dipantau secara real-time.
                    Kami berkomitmen menindaklanjuti setiap laporan Anda.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200"
                    >
                        Mulai Melapor
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors border border-gray-200"
                    >
                        Sudah Punya Akun? Masuk
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { value: '1.2K+', label: 'Pengaduan Masuk' },
                        { value: '98%', label: 'Ditindaklanjuti' },
                        { value: '<24 Jam', label: 'Respon Pertama' },
                        { value: '500+', label: 'Pengguna Aktif' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                            <p className="text-2xl font-bold text-indigo-600 mb-1">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Kenapa Menggunakan Platform Ini?</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm">
                        Dirancang untuk memudahkan masyarakat dalam menyampaikan aspirasi dan keluhan secara efektif
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                        {
                            icon: ClipboardList,
                            color: 'bg-indigo-500',
                            title: 'Laporan Mudah',
                            desc: 'Buat laporan pengaduan dengan mudah, lengkap dengan foto dan lokasi kejadian.',
                        },
                        {
                            icon: Bell,
                            color: 'bg-blue-500',
                            title: 'Notifikasi Real-time',
                            desc: 'Dapatkan pembaruan status pengaduan Anda secara langsung melalui notifikasi.',
                        },
                        {
                            icon: MessageSquare,
                            color: 'bg-violet-500',
                            title: 'Komunikasi Dua Arah',
                            desc: 'Berdialog langsung dengan petugas yang menangani pengaduan Anda.',
                        },
                        {
                            icon: Shield,
                            color: 'bg-green-500',
                            title: 'Terverifikasi',
                            desc: 'Setiap pengaduan diverifikasi dan divalidasi oleh admin sebelum ditindaklanjuti.',
                        },
                        {
                            icon: Users,
                            color: 'bg-orange-500',
                            title: 'Multi Peran',
                            desc: 'Sistem dengan 3 tingkat akses: Administrator, Petugas, dan Masyarakat.',
                        },
                        {
                            icon: CheckCircle,
                            color: 'bg-pink-500',
                            title: 'Pantau Status',
                            desc: 'Lacak perkembangan pengaduan Anda dari menunggu hingga selesai ditangani.',
                        },
                    ].map(f => (
                        <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                                <f.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="bg-indigo-600 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Cara Kerja</h2>
                    <p className="text-indigo-200 text-sm mb-12">Hanya 4 langkah mudah untuk menyampaikan pengaduan</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Daftar Akun', desc: 'Buat akun dengan NIK dan data diri Anda' },
                            { step: '02', title: 'Buat Laporan', desc: 'Isi form pengaduan dengan lengkap dan jelas' },
                            { step: '03', title: 'Verifikasi Admin', desc: 'Admin memverifikasi dan menugaskan petugas' },
                            { step: '04', title: 'Selesai', desc: 'Pantau status dan terima tanggapan dari petugas' },
                        ].map(s => (
                            <div key={s.step} className="text-center">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-lg">{s.step}</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Siap Menyampaikan Pengaduan?</h2>
                <p className="text-gray-500 mb-8 text-sm">Bergabung bersama ribuan masyarakat yang telah mempercayakan aspirasinya kepada kami</p>
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200"
                >
                    Daftar Sekarang — Gratis
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-white py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Pengaduan Masyarakat</span>
                    </div>
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} Hak Cipta Dilindungi</p>
                </div>
            </footer>
        </div>
    );
}
