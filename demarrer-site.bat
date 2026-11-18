@echo off
REM ===================================================
REM Lance le site en local : MySQL + serveur PHP
REM Double-cliquez sur ce fichier, puis ouvrez http://localhost:8000
REM Administration : http://localhost:8000/admin/
REM Fermez cette fenetre pour arreter le serveur PHP.
REM ===================================================
chcp 65001 >nul
set MYSQL_DIR=C:\Users\RPC\mysql
set MYSQL_BIN=%MYSQL_DIR%\mysql-8.4.11-winx64\bin

REM Demarre MySQL s'il ne tourne pas deja
tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if errorlevel 1 (
    echo Demarrage de MySQL...
    start "MySQL" /MIN "%MYSQL_BIN%\mysqld.exe" --defaults-file="%MYSQL_DIR%\my.ini"
    timeout /t 4 /nobreak >nul
) else (
    echo MySQL est deja en marche.
)

echo.
echo Site       : http://localhost:8000
echo Admin      : http://localhost:8000/admin/
echo.
start "" http://localhost:8000
cd /d "%~dp0"
php -d extension=pdo_mysql -d upload_max_filesize=8M -d post_max_size=10M -S localhost:8000
