# Docker Setup for E-commerce Application

This project includes Docker configuration for both production and development environments.

## Quick Start

### Production Build
```bash
# Build and run the production application
docker-compose up -d --build

# Access the application at http://localhost:3000
```

### Development Build
```bash
# Build and run the development environment with hot reloading
docker-compose --profile dev up -d --build

# Access the development server at http://localhost:5173
```

## Docker Commands

### Production
```bash
# Build and start production container
docker-compose up -d --build

# View logs
docker-compose logs -f ecommerce-app

# Stop containers
docker-compose down

# Remove containers and images
docker-compose down --rmi all
```

### Development
```bash
# Start development environment
docker-compose --profile dev up -d --build

# View development logs
docker-compose logs -f ecommerce-dev

# Stop development environment
docker-compose --profile dev down
```

## Docker Images

### Production Image
- **Base**: `node:20-alpine` (multi-stage build)
- **Final**: `nginx:alpine` for serving static files
- **Port**: 80 (mapped to host port 3000)
- **Features**:
  - Optimized for production
  - Gzip compression
  - Security headers
  - Client-side routing support
  - Health checks

### Development Image
- **Base**: `node:20-alpine`
- **Port**: 5173 (Vite dev server)
- **Features**:
  - Hot reloading
  - Volume mounting for live code changes
  - Development dependencies included

## Configuration Files

### Dockerfile
Multi-stage build process:
1. **deps**: Install production dependencies
2. **builder**: Build the React application
3. **runner**: Serve with Nginx

### nginx.conf
- Optimized for React SPA routing
- Gzip compression enabled
- Security headers configured
- Static asset caching
- Health check endpoint

### docker-compose.yml
- Production service with health checks
- Development service with hot reloading
- Network configuration
- Volume mounting for development

## Environment Variables

The application uses the following environment variables:
- `NODE_ENV`: Set to `production` or `development`

## Health Checks

The production container includes health checks:
- Endpoint: `/health`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Change port in docker-compose.yml
   ports:
     - "3001:80"  # Change 3000 to 3001
   ```

2. **Build fails**:
   ```bash
   # Clean up and rebuild
   docker-compose down --rmi all
   docker system prune -f
   docker-compose up -d --build
   ```

3. **Permission issues**:
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Logs
```bash
# View application logs
docker-compose logs ecommerce-app

# View nginx logs
docker exec ecommerce-clothes tail -f /var/log/nginx/access.log
docker exec ecommerce-clothes tail -f /var/log/nginx/error.log
```

## Performance Optimization

The Docker setup includes several optimizations:
- Multi-stage builds to reduce image size
- Nginx for efficient static file serving
- Gzip compression for faster loading
- Proper caching headers
- Alpine Linux for smaller base images

## Security

- Security headers configured in Nginx
- Hidden files access denied
- Content Security Policy headers
- XSS protection enabled 