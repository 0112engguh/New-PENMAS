set -e

echo "▶ Starting Laravel on Render..."

php artisan storage:link --force 2>/dev/null || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1)
if [ "$USER_COUNT" = "0" ]; then
    echo "▶ Running seeders..."
    php artisan db:seed --force
fi

echo "▶ Starting Apache..."
apache2-foreground