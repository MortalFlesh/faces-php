# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Fixed
- Remove default value for `LOCALHOST` environment value in info
- Disable deprecated PHP warnings in face API

## [1.5.0] - 2025-11-18

### Added
- Add `ROLE` environment variable for Docker images to specify the role of the container (dashboard or face API)

## [1.4.0] - 2025-11-18

### Added
- Added `/health-check` app
- Added `/info` app
- Show health status on dashboard

## [1.3.0] - 2025-11-07

### Added
- Added `/smiley` app
- Added `/color` app
- Faces app fetches smiley and color

### Fixed
- Renamed default Favicon to just favicon.

## [1.2.2] - 2025-11-07

### Fixed
- Face docker runs src instead of public

## [1.2.1] - 2025-11-07

### Fixed
- Use encoded smiley face in API response to prevent rendering issues

## [1.2.0] - 2025-11-07

### Fixed
- Encoding api response

## [1.1.0] - 2025-11-07

### Added
- Favicon images (48x48 and 96x96) for better browser tab identification
    - Renamed from `icons8-slightly-smiling-face-*.png` to `favicon-*.png`
    - Added to index.html with proper meta tags

## [1.0.4] - 2025-11-07

### Fixed
- Corrected copying of static assets in Dockerfile for `faces-dashboard`
  - Ensured all necessary static files are included in the final image
  - Prevented potential runtime errors due to missing assets

## [1.0.3] - 2025-11-07

### Fixed
- Webpack output path corrected to build files directly in `public/` directory
  - `main.min.js` and `main.min.css` now output alongside `index.html`
  - Previously built to `public/main/` subdirectory causing serving issues
  - Updated `.gitignore` and `.dockerignore` accordingly

## [1.0.2] - 2025-11-07

### Fixed
- Nginx configuration updated to work correctly in Kubernetes environment
    - Removed API proxy configuration (API runs as separate service)
    - Simplified configuration to serve static files only
    - Dashboard now expects API to be available via standard k8s service discovery

## [1.0.0] - 2025-11-07

### Added
- Initial implementation of Faces application
- React-based dashboard with TypeScript and RxJS
- Real-time face fetching with continuous updates
- PHP API backend serving face data on `/face` endpoint
- 16-face grid with staggered fetch pattern (inspired by faces-demo)
- Error handling for timeouts, parse errors, and network failures
- Loading states with animated placeholders
- Smooth transitions for face updates
- Docker support:
  - `faces-dashboard` - Nginx-based dashboard container (port 3000)
  - `faces-face` - PHP API container (port 8080)
- GitHub Actions CI/CD pipeline for automated Docker builds
- Makefile for convenient Docker operations
- Face legend showing different states (initial, error, timeout, parse error)
- Context-based configuration for interval and face count
- RxJS-powered reactive face fetching with independent face cycles

### Technical Details
- Frontend: React 19, TypeScript, RxJS, SCSS, Webpack
- Backend: PHP 8.4
- Deployment: Docker multi-stage builds, Nginx, GitHub Container Registry

[1.0.0]: https://github.com/MortalFlesh/faces-php/releases/tag/v1.0.0

