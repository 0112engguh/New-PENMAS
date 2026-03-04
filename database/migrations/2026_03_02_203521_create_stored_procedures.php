<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::unprepared("
            DROP PROCEDURE IF EXISTS sp_summary_pengaduan;
            CREATE PROCEDURE sp_summary_pengaduan(
                IN p_bulan INT,
                IN p_tahun INT
            )
            BEGIN
                SELECT
                    status,
                    COUNT(*) as total,
                    kategori
                FROM pengaduans
                WHERE
                    (p_bulan IS NULL OR MONTH(created_at) = p_bulan) AND
                    (p_tahun IS NULL OR YEAR(created_at) = p_tahun)
                GROUP BY status, kategori
                ORDER BY total DESC;
            END
        ");

        DB::unprepared("
            DROP PROCEDURE IF EXISTS sp_pengaduan_petugas;
            CREATE PROCEDURE sp_pengaduan_petugas(IN p_petugas_id INT)
            BEGIN
                SELECT
                    p.*,
                    u.name as pelapor_name,
                    u.nik as pelapor_nik
                FROM pengaduans p
                JOIN users u ON p.user_id = u.id
                WHERE p.petugas_id = p_petugas_id
                ORDER BY p.created_at DESC;
            END
        ");

        DB::unprepared("
            DROP PROCEDURE IF EXISTS sp_update_status_pengaduan;
            CREATE PROCEDURE sp_update_status_pengaduan(
                IN p_id INT,
                IN p_status VARCHAR(20),
                IN p_petugas_id INT
            )
            BEGIN
                DECLARE v_user_id INT;
                DECLARE v_kode VARCHAR(20);

                SELECT user_id, kode_aduan INTO v_user_id, v_kode
                FROM pengaduans WHERE id = p_id;

                UPDATE pengaduans
                SET status = p_status, updated_at = NOW()
                WHERE id = p_id;

                INSERT INTO notifikasis (user_id, judul, pesan, created_at, updated_at)
                VALUES (
                    v_user_id,
                    'Status Pengaduan Diperbarui',
                    CONCAT('Pengaduan ', v_kode, ' sekarang: ', p_status),
                    NOW(), NOW()
                );

                SELECT ROW_COUNT() as affected_rows;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_summary_pengaduan");
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_pengaduan_petugas");
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_update_status_pengaduan");
    }
};