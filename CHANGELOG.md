# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

