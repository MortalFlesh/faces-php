# Quick Start Guide

## Prerequisites

1. **Docker** installed and running
2. **Backend API** running on `http://localhost:8080`

## Steps

### 1. Start your backend API service

Make sure your faces backend API is running on port 8080:
```bash
# Example - adjust according to your backend setup
php -S localhost:8080 -t public
```

Test that it's working:
```bash
curl http://localhost:8080/face
```

### 2. Build and run the dashboard

From the project root directory:

```bash
cd dockers
docker-compose up --build
```

Or without docker-compose:
```bash
docker build -f dockers/dashboard.Dockerfile -t faces-dashboard .
docker run -p 3000:3000 --add-host host.docker.internal:host-gateway faces-dashboard
```

### 3. Access the dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Stop the dashboard

If using docker-compose:
```bash
docker-compose down
```

If using docker run, press `Ctrl+C` in the terminal.

## Troubleshooting

### Dashboard loads but faces don't appear

- Verify your backend API is running: `curl http://localhost:8080/face`
- Check Docker logs: `docker-compose logs` or `docker logs faces-dashboard`
- Check browser console for errors

### Port 3000 already in use

Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

Then access at `http://localhost:3001`

### Cannot connect to backend API from Docker

Make sure you're using `host.docker.internal:8080` in the nginx config (already configured).

On Linux, you may need to use `--network host` instead:
```bash
docker run --network host faces-dashboard
```

