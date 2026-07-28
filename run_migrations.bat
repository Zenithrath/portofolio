@echo off
cd /d c:\laragon\www\dijerimek
echo Running migrations...
php artisan migrate
echo.
echo Migrations completed!
pause
