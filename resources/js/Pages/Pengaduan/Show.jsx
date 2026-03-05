import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Send, User, Calendar, MapPin, Tag,
    ImagePlus, X, FileImage, Trash2, ZoomIn,
    CheckCircle, Clock, XCircle, ShieldCheck
} from 'lucide-react';

import Lightbox from '@/components/Lightbox';
import GlassConfirmModal from '@/components/GlassConfirmModal';
import TanggapanBubble from '@/components/TanggapanBubble';

const STATUS_STYLES = {
    menunggu: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'Menunggu', icon: Clock },
    diproses: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: 'Diproses', icon: ShieldCheck },
    selesai:  { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Selesai', icon: CheckCircle },
    ditolak:  { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Ditolak', icon: XCircle },
};

export default function Show({ pengaduan, petugasList }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [sending, setSending] = useState(false);
    const [lightbox, setLightbox] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [nextStatus, setNextStatus] = useState(null);

    const fileRef = useRef();

    const s = STATUS_STYLES[pengaduan.status] ?? STATUS_STYLES.menunggu;
    const StatusIcon = s.icon;

    const handleUpdateStatus = (status) => {
        setNextStatus(status);
        setConfirmOpen(true);
    };

    const confirmStatusChange = () => {
        router.post(`/pengaduan/${pengaduan.id}/status`,
            { status: nextStatus },
            {
                onFinish: () => {
                    setConfirmOpen(false);
                    setNextStatus(null);
                }
            }
        );
    };

    const handleSend = e => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        setSending(true);

        const fd = new FormData();
        fd.append('tanggapan', text);
        if (file) fd.append('lampiran', file);

        router.post(`/pengaduan/${pengaduan.id}/tanggapan`, fd, {
            forceFormData: true,
            onFinish: () => {
                setSending(false);
                setText('');
                setFile(null);
                setPreview(null);
            }
        });
    };

    return (
        <AppLayout title={`Pengaduan #${pengaduan.kode_aduan}`}>
            <Head title={`Pengaduan - ${pengaduan.judul}`} />

            <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

            <GlassConfirmModal
                open={confirmOpen}
                title="Konfirmasi Perubahan Status"
                message={`Yakin ingin mengubah status menjadi "${nextStatus}"?`}
                confirmText="Ya, Ubah"
                onConfirm={confirmStatusChange}
                onCancel={() => setConfirmOpen(false)}
            />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                {pengaduan.kode_aduan}
                            </span>
                            <h2 className="text-xl font-bold mt-2">
                                {pengaduan.judul}
                            </h2>
                        </div>

                        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                            <StatusIcon className="w-4 h-4" />
                            {s.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {pengaduan.user?.name}
                        </div>
                        <div className="flex items-center gap-2 capitalize">
                            <Tag className="w-4 h-4" />
                            {pengaduan.kategori}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(pengaduan.tanggal_pengaduan).toLocaleDateString('id-ID')}
                        </div>
                        {pengaduan.lokasi && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {pengaduan.lokasi}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed mb-4">
                        {pengaduan.isi_laporan}
                    </div>

                    {pengaduan.foto_url && (
                        <div
                            className="rounded-xl overflow-hidden cursor-zoom-in"
                            onClick={() => setLightbox(pengaduan.foto_url)}
                        >
                            <img
                                src={pengaduan.foto_url}
                                className="w-full max-h-72 object-cover"
                            />
                        </div>
                    )}

                    <div className="flex gap-2 mt-6 flex-wrap">
                        {(user.role === 'admin' || user.role === 'petugas') && (
                            <>
                                {pengaduan.status === 'menunggu' && (
                                    <button
                                        onClick={() => handleUpdateStatus('diproses')}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl"
                                    >
                                        Tandai Diproses
                                    </button>
                                )}

                                {pengaduan.status === 'diproses' && (
                                    <button
                                        onClick={() => handleUpdateStatus('selesai')}
                                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl"
                                    >
                                        Tandai Selesai
                                    </button>
                                )}

                                <button
                                    onClick={() => handleUpdateStatus('ditolak')}
                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl"
                                >
                                    Tolak
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold mb-4">
                        Tanggapan ({pengaduan.tanggapans?.length || 0})
                    </h3>

                    <div className="space-y-4 mb-6">
                        {pengaduan.tanggapans?.map(t => (
                            <TanggapanBubble
                                key={t.id}
                                t={t}
                                currentUserId={user.id}
                                onDelete={(id) => router.delete(`/tanggapan/${id}`)}
                                onLightbox={setLightbox}
                            />
                        ))}
                    </div>

                    {pengaduan.status !== 'ditolak' && (
                        <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 border rounded-xl p-2">
                            <textarea
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Tulis tanggapan..."
                                className="flex-1 bg-transparent resize-none outline-none text-sm"
                            />

                            <button
                                type="submit"
                                disabled={sending}
                                className="p-2 bg-indigo-600 text-white rounded-lg"
                            >
                                {sending ? '...' : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}