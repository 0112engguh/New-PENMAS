import { X } from "lucide-react";

export default function GlassConfirmModal({
    open,
    title = "Konfirmasi",
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                onClick={onCancel}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="relative z-10 w-full max-w-sm animate-[fadeIn_.2s_ease-out]">
                <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {title}
                        </h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white/50 hover:bg-white transition"
                        >
                            {cancelText}
                        </button>

                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}