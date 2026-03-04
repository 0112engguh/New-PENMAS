<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nik', 16)->unique()->nullable();
            $table->string('username', 25)->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone', 13)->nullable();
            $table->string('address')->nullable();
            $table->enum('role', ['admin', 'petugas', 'masyarakat'])->default('masyarakat');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};