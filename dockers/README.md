# Faces Dashboard Docker

This directory contains Docker configuration for the Faces Dashboard application.

> 📖 **New here?** Check out [QUICKSTART.md](QUICKSTART.md) for a step-by-step guide!

> ⚡ **Quick commands:** Use the included `Makefile` for convenience:
> ```bash
> make build   # Build the image
> make up      # Start the dashboard
> make down    # Stop the dashboard
> make logs    # View logs
> make help    # Show all available commands
> ```

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Building the Image

### Using Docker Compose (Recommended)

```bash
cd dockers
docker-compose build
```

### Using Docker directly

```bash
docker build -f dockers/dashboard.Dockerfile -t faces-dashboard .
```

## Running the Container

### Using Docker Compose (Recommended)

```bash
cd dockers
docker-compose up
```

To run in detached mode:
```bash
docker-compose up -d
```

To stop:
```bash
docker-compose down
```

### Using Docker directly

```bash
docker run -p 3000:3000 --add-host host.docker.internal:host-gateway faces-dashboard
```

## Accessing the Application

Once running, the dashboard will be available at:
- http://localhost:3000

## Configuration

### Port Configuration

The default port is 3000. To change it, edit the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:3000"
```

### API Backend (External Service)

**Important**: The API backend service is NOT included in this Docker container. The dashboard expects the API to be running externally.

The dashboard is configured to proxy `/face` requests to `http://host.docker.internal:8080`. This means:
- Your backend API must be running on port 8080 on your host machine
- The Docker container will forward requests from the browser to your local API

To change the backend URL or port, edit the `proxy_pass` directive in `etc/nginx.conf`:

```nginx
location /face {
    proxy_pass http://host.docker.internal:YOUR_PORT;
    # ...
}
```

After changing the configuration, rebuild the Docker image.

## Architecture

The Docker image uses a multi-stage build:

1. **Builder Stage**: Uses Node.js 20 Alpine to install dependencies and build the React application with webpack
2. **Production Stage**: Uses Nginx Alpine to serve the built static files on port 3000

This approach results in a small, optimized production image (~50MB) that only contains the necessary runtime files.

### Configuration Files

- **`etc/nginx.conf`**: Nginx server configuration (copied into the Docker image)
  - Serves the dashboard on port 3000
  - Proxies `/face` API requests to external backend
  - Enables gzip compression and caching
  - Adds security headers

## Features

- ✅ Production-optimized build with webpack
- ✅ Gzip compression enabled
- ✅ Proxy configuration for `/face` API endpoint
- ✅ Multi-stage build for minimal image size
- ✅ Nginx serving on port 3000
- ✅ Hot reload for API backend via proxy

## Troubleshooting

### Cannot connect to backend API

Make sure your backend is running on port 8080. You can test it with:
```bash
curl http://localhost:8080/face
```

### Port already in use

If port 3000 is already in use, change the port mapping in `docker-compose.yml` or use a different port when running with `docker run`.

### Build fails

Make sure you're running the build command from the project root directory, not from the `dockers` directory.

