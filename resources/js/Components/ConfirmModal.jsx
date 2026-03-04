import { useEffect } from "react";

export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    loading = false,
}) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onCancel();
        };

        if (show) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                onClick={onCancel}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            />

            <div className="relative w-full max-w-md p-6 rounded-3xl 
                            bg-white/20 backdrop-blur-xl 
                            border border-white/30
                            shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                            animate-fadeIn
                            z-10">

                <h3 className="text-lg font-semibold text-white mb-2">
                    {title}
                </h3>

                <p className="text-sm text-white/80 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm 
                                   bg-white/30 hover:bg-white/40 
                                   text-white transition
                                   disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm 
                                   bg-blue-500 hover:bg-blue-600 
                                   text-white transition
                                   flex items-center gap-2
                                   disabled:opacity-70"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {loading ? "Memproses..." : "Ya, Lanjutkan"}
                    </button>
                </div>
            </div>
        </div>
    );
}