import { useState } from "react";
import { router } from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal";

export default function UpdateStatusButton({ pengaduan, user }) {

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const openModal = (status) => {
        setSelectedStatus(status);
        setShowModal(true);
    };

    const handleConfirm = () => {
        setLoading(true);

        router.post(`/pengaduan/${pengaduan.id}/status`,
            { status: selectedStatus },
            {
                onFinish: () => {
                    setLoading(false);
                    setShowModal(false);
                }
            }
        );
    };

    if (
        !(user.role === "petugas" || user.role === "admin") ||
        pengaduan.status === "ditolak" ||
        pengaduan.status === "selesai"
    ) {
        return null;
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                    Update Status Pengaduan
                </h3>

                <div className="flex flex-wrap gap-3">
                    {pengaduan.status === "menunggu" && (
                        <button
                            onClick={() => openModal("diproses")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                            ⚡ Tandai Sedang Diproses
                        </button>
                    )}

                    {pengaduan.status === "diproses" && (
                        <button
                            onClick={() => openModal("selesai")}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                            ✅ Tandai Selesai
                        </button>
                    )}

                    {user.role === "admin" && (
                        <button
                            onClick={() => openModal("ditolak")}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                            ✗ Tolak Pengaduan
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                    Status saat ini:
                    <span className="ml-1 font-medium capitalize text-gray-600">
                        {pengaduan.status}
                    </span>
                </p>
            </div>

            <ConfirmModal
                show={showModal}
                title="Konfirmasi Perubahan Status"
                message={`Apakah Anda yakin ingin mengubah status menjadi "${selectedStatus}"?`}
                onConfirm={handleConfirm}
                onCancel={() => setShowModal(false)}
                loading={loading}
            />
        </>
    );
}