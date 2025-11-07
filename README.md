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

