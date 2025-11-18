Faces App
=========

    Browser
    │
    │ AJAX/fetch
    │
    ▼
    ┌─────────────┐
    │  faces-gui  │ (static HTML/JS)
    │   (nginx)   │
    └─────────────┘
    │
    │ HTTP GET /face/
    │
    ▼
    ┌─────────────┐
    │    face     │ (PHP backend)
    │  service    │
    └─────────────┘
    │         │
    │         │ HTTP requests (backend-to-backend)
    │         │
    ▼         ▼
    ┌────────┐ ┌────────┐
    │ smiley │ │ color  │ <-- HTTPRoute splits these!
    │ service│ │service │
    └────────┘ └────────┘
    │         │
    ▼         ▼
    ┌─────────┐ ┌────────┐
    │smiley2  │ │color2  │ <-- 50% traffic goes here
    └─────────┘ └────────┘

## Usage

### Environment variables / Configuation

Common
- `LOCALHOST`
- `ENABLE_SLEEP`
- `ROLE`

Faces app
- `SMILEY_HOST`
- `COLOR_HOST`

Smiley app
- `SMILEY`

Color app
- `COLOR`

### Role
> The `ROLE` environment variable determines which component the container will run. 

Possible values are:
- `face` - runs the Faces API backend service
- `smiley` - runs the Smiley service
- `color` - runs the Color service

If the role is set, the app will return its content not on the specific path, but on root

For example
Normally /smiley would return the smiley face, but with ROLE=smiley, / will return the smiley face.

Role based app will also have the common endpoints, such as `/health-check` and `/info`
