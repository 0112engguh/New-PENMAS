import { X } from "lucide-react";

export default function Lightbox({ src, onClose }) {
    if (!src) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
            <img
                src={src}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />

            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}