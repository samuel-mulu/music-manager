@echo off
setlocal enabledelayedexpansion

REM Docker Scripts for Song API Backend (Windows)

:main
if "%1"=="build" goto build
if "%1"=="run" goto run
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="status" goto status
if "%1"=="cleanup" goto cleanup
if "%1"=="migrate" goto migrate
if "%1"=="help" goto help
if "%1"=="--help" goto help
if "%1"=="-h" goto help
goto help

:build
echo [INFO] Building Docker image for Song API...
docker build -t song-api-backend:latest .
if %errorlevel% equ 0 (
    echo [SUCCESS] Docker image built successfully!
) else (
    echo [ERROR] Failed to build Docker image
    exit /b 1
)
goto end

:run
echo [INFO] Starting services with Docker Compose...
docker-compose up -d
if %errorlevel% equ 0 (
    echo [SUCCESS] Services started successfully!
    echo [INFO] API available at: http://localhost:5000
    echo [INFO] MongoDB available at: localhost:27017
    echo [INFO] Redis available at: localhost:6379
) else (
    echo [ERROR] Failed to start services
    exit /b 1
)
goto end

:stop
echo [INFO] Stopping all services...
docker-compose down
echo [SUCCESS] All services stopped!
goto end

:logs
echo [INFO] Viewing logs...
docker-compose logs -f
goto end

:status
echo [INFO] Service Status:
docker-compose ps
goto end

:cleanup
echo [WARNING] This will remove all containers, volumes, and images. Are you sure? (y/N)
set /p response=
if /i "%response%"=="y" (
    echo [INFO] Cleaning up...
    docker-compose down -v --rmi all
    docker system prune -f
    echo [SUCCESS] Cleanup completed!
) else (
    echo [INFO] Cleanup cancelled
)
goto end

:migrate
echo [INFO] Running database migrations...
docker-compose exec backend npm run migrate
goto end

:help
echo Song API Docker Management Script
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   build     Build the Docker image
echo   run       Start all services with Docker Compose
echo   stop      Stop all services
echo   logs      View logs from all services
echo   status    Show status of all services
echo   cleanup   Remove all containers, volumes, and images
echo   migrate   Run database migrations
echo   help      Show this help message
echo.
goto end

:end
endlocal
