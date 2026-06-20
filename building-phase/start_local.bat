@echo off
setlocal
set "ROOT=%~dp0"
set "PATH=%ROOT%.tooling\php;%PATH%"
cd /d "%ROOT%VEFS-website"
echo Starting VEFS local server at http://localhost:8000
php -S localhost:8000 router.php
endlocal
