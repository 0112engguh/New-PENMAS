import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, BellOff, CheckCheck } from 'lucide-react';

export default function NotifikasiIndex({ notifikasis }) {
    return (
        <AppLayout title="Notifikasi">
            <Head title="Notifikasi" />

            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900">Notifikasi</h2>
                    <button
                        onClick={() => router.post('/notifikasi/read-all')}
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Tandai semua dibaca
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {notifikasis.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <BellOff className="w-10 h-10 mb-3" />
                            <p className="text-sm">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifikasis.data.map(n => (
                                <div
                                    key={n.id}
                                    className={`flex gap-4 px-5 py-4 hover:bg-gray-50 transition-colors
                                        ${!n.is_read ? 'bg-indigo-50/50' : ''}`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                                        ${!n.is_read ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                        <Bell className={`w-4 h-4 ${!n.is_read ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {n.judul}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">{n.pesan}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(n.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    {!n.is_read && (
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}