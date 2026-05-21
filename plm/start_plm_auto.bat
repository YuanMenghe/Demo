@echo off
cd /d "%~dp0"

echo PLM dev server
if not exist package.json goto err
if not exist node_modules\ goto install
goto run

:install
echo Installing...
npm install
goto run

:run
echo.
echo Open browser: http://localhost:3000
echo.
npm run dev
goto end

:err
echo Error: run this bat inside plm folder
:end
pause
