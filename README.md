# Video card (Webflow)

Review-style card with a play trigger: content fades out, a full-bleed Video.js player fades in and plays. Pause, scroll off-screen, or end of video brings the content back. Click play again to resume (or restart after the video ended).

Stack: **HTML**, **CSS**, **jQuery**, **Video.js 10 (CDN)** — no React.

## Files

| File | Role |
|------|------|
| `video-card.css` | Card layout, cover video, player overrides |
| `video-card.js` | Fade, play/pause, viewport pause |
| `index.html` | Local demo only |

## Webflow integration

### 1. Site / page custom code

**Head** (before `</head>`):

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@videojs/cdn@10.3.0/video.js"></script>
<link rel="stylesheet" href="/path/to/video-card.css" />
```

**Footer** (before `</body>`):

```html
<script src="/path/to/video-card.js"></script>
```

Host `video-card.css` and `video-card.js` on your CDN or Webflow assets and use those URLs instead of `/path/to/…`.

Skip jQuery in the head if Webflow already loads it.

### 2. Card markup

Use one wrapper per card. Put the video layer inside the card; style height/width in Webflow as needed (`video-card.css` sets **530px** card height by default).

```html
<article data-video-card="card">
  <div data-video-card="content">
    <!-- quote, avatar, etc. -->
    <button type="button" data-video-card="trigger">Watch review</button>
  </div>

  <div data-video-card="video" data-video-card-duration="400">
    <video-player>
      <video-skin style="--media-border-radius: 0">
        <video src="https://example.com/video.mp4" playsinline preload="metadata">
          <a href="https://videojs.org/help">Video player not working?</a>
        </video>
      </video-skin>
    </video-player>
  </div>
</article>
```

### 3. Data attributes

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `data-video-card="card"` | Root | Card container; viewport observer target |
| `data-video-card="content"` | Div | Review UI (hidden while video plays) |
| `data-video-card="video"` | Div | Player wrapper (absolute, full card) |
| `data-video-card="trigger"` | Button | Play / resume |
| `data-video-card-duration="400"` | `[data-video-card="video"]` | Fade duration in ms (default **400**) |

## Behaviour

- **Play** → content fades out, video fades in, playback starts (sound allowed; requires user click).
- **Pause** (controls) → video hidden, content returns; position kept for resume.
- **Ended** → content returns, time reset to 0; next play starts from the beginning.
- **Card leaves viewport** while playing → video pauses (content returns via pause handling).

## Styling notes

- Video fills the card with **`object-fit: cover`** (see `video-card.css`).
- Square player frame: `--media-border-radius: 0` on `video-skin` (also set in CSS).
- Override card height in Webflow if you don’t want 530px.

## Local demo

From this folder:

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765/` and use `index.html`.
