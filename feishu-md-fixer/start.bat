@echo off
setlocal
cd /d "%~dp0"

set "PORT=4173"
set "SITE_URL=http://127.0.0.1:%PORT%/"

echo [1/3] Building site...
call npm run build
if errorlevel 1 (
  echo Build failed. Check the error output above.
  pause
  exit /b 1
)

echo [2/3] Starting preview server at %SITE_URL% ...
start "feishu-md-fixer-preview" /min cmd /c "cd /d ""%~dp0"" && npm run preview -- --host 127.0.0.1 --port %PORT% --strictPort"

echo [3/3] Waiting for preview server...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline=(Get-Date).AddSeconds(20); while((Get-Date) -lt $deadline){ try { $client = New-Object Net.Sockets.TcpClient('127.0.0.1', %PORT%); $client.Close(); exit 0 } catch { Start-Sleep -Milliseconds 300 } }; exit 1"

if errorlevel 1 (
  echo Preview server timed out. Open %SITE_URL% manually.
  pause
  exit /b 1
)

set "EDGE_EXE="
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
  set "EDGE_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
  set "EDGE_EXE=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)

if "%EDGE_EXE%"=="" (
  echo Edge not found. Opening with the default browser.
  start "" "%SITE_URL%"
  exit /b 0
)

set "PROFILE_DIR=%~dp0.edge-profile"
echo Opening browser...
start "" "%EDGE_EXE%" --user-data-dir="%PROFILE_DIR%" "%SITE_URL%"
