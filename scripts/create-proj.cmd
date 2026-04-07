@echo off
setlocal

if "%~1"=="" (
    echo.
    echo  Uso: create-proj ^<nome-do-projeto^>
    echo  Exemplo: create-proj meu-sistema
    echo.
    exit /b 1
)

set NOME=%~1
set BASEURL=%~2

if "%BASEURL%"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0novo-projeto.ps1" -Nome "%NOME%"
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0novo-projeto.ps1" -Nome "%NOME%" -BaseURL "%BASEURL%"
)

endlocal

