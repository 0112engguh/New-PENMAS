import { Trash2, FileImage, ZoomIn } from "lucide-react";

const TIPE_STYLES = {
    admin: {
        bubble: "bg-rose-50 border-rose-100",
        badge: "bg-rose-100 text-rose-600",
        avatar: "bg-gradient-to-br from-rose-400 to-pink-500",
    },
    petugas: {
        bubble: "bg-blue-50 border-blue-100",
        badge: "bg-blue-100 text-blue-600",
        avatar: "bg-gradient-to-br from-blue-400 to-cyan-500",
    },
    masyarakat: {
        bubble: "bg-gray-50 border-gray-100",
        badge: "bg-gray-100 text-gray-500",
        avatar: "bg-gradient-to-br from-indigo-400 to-violet-500",
    },
};

export default function TanggapanBubble({
    t,
    currentUserId,
    onDelete,
    onLightbox,
}) {
    const isStaff = t.tipe !== "masyarakat";
    const tipe = TIPE_STYLES[t.tipe] ?? TIPE_STYLES.masyarakat;
    const lampiranUrl = t.lampiran ? `/storage/${t.lampiran}` : null;
    const isPdf = t.lampiran?.toLowerCase().endsWith(".pdf");

    return (
        <div className={`flex gap-3 ${isStaff ? "flex-row-reverse" : ""} items-end`}>
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${tipe.avatar}`}
            >
                {t.user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className={`flex flex-col gap-1 max-w-sm ${isStaff ? "items-end" : ""}`}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                        {t.user?.name}
                    </span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipe.badge}`}
                    >
                        {t.tipe}
                    </span>
                </div>

                <div
                    className={`rounded-2xl border overflow-hidden ${tipe.bubble}`}
                >
                    {lampiranUrl && !isPdf && (
                        <div
                            className="relative cursor-zoom-in group"
                            onClick={() => onLightbox(lampiranUrl)}
                        >
                            <img
                                src={lampiranUrl}
                                alt="Lampiran"
                                className="w-full max-w-xs h-44 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
                            </div>
                        </div>
                    )}

                    {lampiranUrl && isPdf && (
                        <div className="px-4 pt-3">
                            <a
                                href={lampiranUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-white/60 hover:bg-white/90 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-600"
                            >
                                <FileImage className="w-4 h-4" />
                                Lihat Lampiran PDF
                            </a>
                        </div>
                    )}

                    {t.tanggapan && (
                        <p className="text-sm text-gray-700 px-4 py-3">
                            {t.tanggapan}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleString("id-ID")}

                    {t.user_id === currentUserId && (
                        <button
                            onClick={() => onDelete(t.id)}
                            className="hover:text-red-500"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}