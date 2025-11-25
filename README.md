# Local Viral Image Generator (100% Local, No External APIs)

This project turns your existing image assets into a fully local viral-image generator:

- Backend: Node.js + Express + Sharp
- Frontend: Simple HTML/CSS/JS served from `/public`
- No external network calls or API keys required

The server:
- Serves static files from `/public`
- Provides `GET /generate` to choose a random local image
- Provides `POST /overlay` to render a text overlay using Sharp and returns a local PNG URL

On first run the server will:
- Ensure `public/`, `public/images/`, and `public/outputs/` exist
- Copy one of the existing demo images (`images/mountain-landscape.jpg`) into `public/images/sample-mountain.jpg`
- Create `public/fallback.png` (converted from the same local image) if it does not already exist

## Project Structure

- `server.js` – Express server and Sharp overlay logic
- `package.json` – Node project definition and scripts
- `public/`
  - `index.html` – UI for generating and downloading images
  - `styles.css` – Basic layout and styling
  - `script.js` – Frontend logic for calling `/generate` and `/overlay`
  - `fallback.png` – Created automatically from a local image on first run
  - `images/` – Local source images (sample is created automatically)
  - `outputs/` – Generated images with text overlays (created at runtime)

Your existing template files are preserved:
- `index.html` (original template)
- `templatemo-3d-coverflow.css`
- `templatemo-3d-coverflow-scripts.js`
- `images/` (original demo images)

The new app uses the `/public` directory and does not rely on the original template files.

## Run Locally

Requirements:
- Node.js (LTS recommended)
- `npm`

Commands:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

No external API keys or network calls are required. All images are loaded from your local filesystem.

## API Endpoints

### GET /generate

Returns a random image URL from `public/images/`. If that folder is empty or an error occurs, falls back to `/fallback.png`.

Response example:

```json
{
  "imageUrl": "/images/sample-mountain.jpg"
}
```

Example curl:

```bash
curl http://localhost:3000/generate
```

### POST /overlay

Accepts a JSON payload describing the image and text to overlay. Uses Sharp to render the text server-side and returns the URL of the generated PNG inside `public/outputs/`.

Request body:

```json
{
  "imageUrl": "/images/sample-mountain.jpg",
  "text": "This is my viral post text",
  "fontSize": 64,
  "color": "#ffffff"
}
```

Notes:
- `imageUrl` must point to a file under `/public` (for example, the URL returned by `/generate`).
- `fontSize` is a number (default 64 if omitted).
- `color` is any valid CSS color string (e.g. `"#fff"` or `"#ff0000"`).

Response example:

```json
{
  "imageUrl": "/outputs/0d9ee2bb-26b9-4be4-a273-9f4e79f8be30.png"
}
```

Example curl:

```bash
curl -X POST http://localhost:3000/overlay \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "/images/sample-mountain.jpg",
    "text": "This is my viral post text",
    "fontSize": 64,
    "color": "#ffffff"
  }'
```

## Frontend Behavior

`public/index.html` provides a minimal UI:

- "Generate Background" button:
  - Calls `GET /generate`
  - Sets the preview image to the returned `imageUrl`

- Text controls:
  - Textarea for overlay text
  - Slider for font size (24–96, default 64)
  - Color picker for text color

- "Apply Text Overlay" button:
  - Sends `POST /overlay` with:
    - `imageUrl`: current preview image URL
    - `text`: textarea contents
    - `fontSize`: slider value
    - `color`: selected color
  - Sets the preview image to the returned final image
  - Enables the "Download Image" button

- "Download Image" button:
  - Triggers a browser download of the most recently generated overlay image

On initial load, the preview points to `/fallback.png`, which is created from a local image by `server.js` (if it does not already exist).

## Deploy / Test Checklist

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open the app in your browser:
   ```text
   http://localhost:3000
   ```
4. Verify `/generate`:
   - Click "Generate Background" in the UI, or run:
     ```bash
     curl http://localhost:3000/generate
     ```
5. Verify `/overlay`:
   - In the UI:
     - Enter overlay text
     - Adjust font size and color
     - Click "Apply Text Overlay"
     - Confirm the preview updates and "Download Image" becomes enabled
   - Or via curl:
     ```bash
     curl -X POST http://localhost:3000/overlay \
       -H "Content-Type: application/json" \
       -d '{
         "imageUrl": "/images/sample-mountain.jpg",
         "text": "Test overlay from curl",
         "fontSize": 64,
         "color": "#ffffff"
       }'
     ```
6. Confirm that:
   - New PNGs appear in `public/outputs/`
   - No external network calls or API keys are required for normal usage

To create a ZIP of the full project, from the repository root run (on macOS/Linux):

```bash
zip -r local-viral-image-generator.zip .
```

On Windows PowerShell:

```powershell
Compress-Archive -Path * -DestinationPath local-viral-image-generator.zip
```

You can then move the ZIP to any machine, extract it, and run with:

```bash
npm install
npm start
open http://localhost:3000
```
