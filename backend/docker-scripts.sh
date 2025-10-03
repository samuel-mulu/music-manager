#!/bin/bash

# Docker Scripts for Song API Backend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Build the Docker image
build_image() {
    print_status "Building Docker image for Song API..."
    docker build -t song-api-backend:latest .
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully!"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Run the application with Docker Compose
run_compose() {
    print_status "Starting services with Docker Compose..."
    docker-compose up -d
    if [ $? -eq 0 ]; then
        print_success "Services started successfully!"
        print_status "API available at: http://localhost:5000"
        print_status "MongoDB available at: localhost:27017"
        print_status "Redis available at: localhost:6379"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped!"
}

# View logs
view_logs() {
    print_status "Viewing logs..."
    docker-compose logs -f
}

# Clean up everything
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show status of services
show_status() {
    print_status "Service Status:"
    docker-compose ps
}

# Execute database migrations (if any)
migrate() {
    print_status "Running database migrations..."
    docker-compose exec backend npm run migrate
}

# Show help
show_help() {
    echo "Song API Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     Build the Docker image"
    echo "  run       Start all services with Docker Compose"
    echo "  stop      Stop all services"
    echo "  logs      View logs from all services"
    echo "  status    Show status of all services"
    echo "  cleanup   Remove all containers, volumes, and images"
    echo "  migrate   Run database migrations"
    echo "  help      Show this help message"
    echo ""
}

# Main script logic
case "$1" in
    build)
        build_image
        ;;
    run)
        run_compose
        ;;
    stop)
        stop_services
        ;;
    logs)
        view_logs
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    migrate)
        migrate
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
