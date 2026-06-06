@echo off
echo Starting Invoice Automation Dev Environment...

echo.
echo [1/2] Starting .NET API on http://localhost:5000
start "InvoiceAPI" cmd /k "cd InvoiceApi && dotnet run --urls http://localhost:5000"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting Angular on http://localhost:4200 (with API proxy)
start "InvoiceAngular" cmd /k "cd invoice-app && npx @angular/cli@18 serve --proxy-config proxy.conf.json --open"

echo.
echo Both servers are starting. Browser will open at http://localhost:4200
