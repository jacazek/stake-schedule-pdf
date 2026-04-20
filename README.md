# Stake Schedule PDF

An Electron desktop application that generates and displays speaking schedules and ministering interview schedules as PDFs from JSON data files. Designed for stake-level organizations to manage speaking assignments across multiple wards and branches.

[See [HOW_TO.md](HOW_TO.md) for usage instructions.]

## Key Features

- **Speaker Schedules** — Stake council member speaking assignments, organized by speaker with table of contents
- **Unit Schedules** — Ward/branch speaking assignments and ministering interviews, organized by unit
- **PDF Generation** — Professional PDFs with title pages, table of contents, and instruction pages
- **Live Data Watching** — Auto-reload when JSON data files change
- **Menu Bar** — Native application menu for data folder selection, navigation, and settings

[See [HOW_TO.md](HOW_TO.md) for detailed usage instructions.]

## Prerequisites

- **Node.js** 24+ (earlier versions may work but untested)
- **Linux dependencies** for Electron: `libnss3`, `libnspr4`, `libasound2`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libcups2`, `libdrm2`, `libxkbcommon0`, `libxcomposite1`, `libxdamage1`, `libxrandr2`, `libgbm1`, `libpango-1.0-0`, `libcairo2`

On openSUSE, install Electron system dependencies with:

```bash
sudo zypper install -y libnss3 libnspr4 alsa-lib libatk1.0-0 libatk-bridge2.0-0 cups-libs libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2
```

## Install dependencies

```bash
npm install
```

## Run

```bash
npm run electron:dev
```

This starts the Vite dev server and launches the Electron app, which connects to the dev server with hot reload.

## Build

### Linux

```bash
npm run electron:build
```

Produces an AppImage in the `dist/` directory (e.g., `dist/stake-schedule-pdf-0.0.0.AppImage`). The AppImage can be run directly on most Linux distributions.

### Windows

```bash
npm run electron:build:win
```

Produces a portable zip archive in the `dist/` directory (e.g., `dist/stake-schedule-pdf-0.0.0-win.zip`). Extract the zip and run `stake-schedule-pdf.exe` on any Windows machine — no installation required.

## Clean

Remove all build artifacts:

```bash
npm run clean
```

This removes `dist/`, `electron/dist/`, and `dist-electron/`.

## Project Structure

- `src/` — React + TypeScript source (components, pages, contexts, utilities)
- `electron/` — Electron main process, preload script, and build config
- `data/` — CSV-to-JSON transform scripts and data directories
- `dist/` — Electron build output
- `dist-electron/` — Compiled Electron JavaScript

## Data Transforms

To prepare and transform CSV to JSON for the application, run the transform scripts from the project root. Running a transform backs up previous output.

- **Speaker transform:** `./data/speaker-transform.sh`
- **Unit transform:** `./data/unit-transform.sh`

For detailed information about the transform scripts and mappers, see the [data directory README](data/README.md).
