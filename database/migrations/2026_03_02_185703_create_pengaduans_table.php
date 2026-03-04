<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengaduans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_aduan', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('petugas_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('judul', 100);
            $table->enum('kategori', ['infrastruktur', 'pelayanan', 'keamanan', 'lingkungan', 'lainnya']);
            $table->text('isi_laporan');
            $table->string('lokasi')->nullable();
            $table->string('foto')->nullable();
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_valid')->default(false);
            $table->text('catatan_admin')->nullable();
            $table->integer('rating')->nullable();
            $table->timestamp('tanggal_pengaduan')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaduans');
    }
};