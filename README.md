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

## Input files

There are 7 input csv files. Contents of each describe below.

### Files

#### `units.csv` — Unit Registry

- **Columns:** `unit_id`, `conference_date`, `unit_name`, `unit_abbrev`
- **10 rows** representing LDS wards/branches in the Durham Stake
- Units: ERS (Eno River Branch - Spanish), MEB (Mebane Ward), UMS (University Ward), D1 (Durham 1st Ward), ROX (Roxboro Branch), HB (Hillsborough Ward), DYSA (Durham YSA Ward), D2 (Durham 2nd Ward), CH1 (Chapel Hill 1st Ward), FSLG (French Sango Language Group)

#### `speakers.csv` — Speaker Directory

- **Columns:** `speaker_id`, `full_name`, `toc_name`, `abbreviated_name`
- **18 rows** — a directory of all speakers referenced in `speaking-assignments.csv`
- Individual speakers have IDs prefixed with `HC` (10 individuals)
- Organization/TOC IDs: `PRI` (Stake Primary), `RS` (Stake Relief Society), `SS`/`SSP` (Stake Sunday School), `YM`/`YMP` (Stake Young Men), `YW` (Stake Young Women)

#### `speaking-assignments.csv` — Monthly Speaking Assignments

- **Columns:** `unit_id`, `speaker_id`, `date`, `notes`
- **47 rows** mapping units to speakers on specific dates throughout 2026 (Jan–Dec)
- Each row represents a speaking assignment at a unit on a given date
- Speakers are either individual people or organizations/TOCs

#### `unit-ministering.csv` — Unit Ministering Interviews

- **Columns:** `stake_presidency_member`, `date_time`, `interviewee`, `interviewee_name`, `unit_id`, `location`
- **36 rows** recording ministering interviews conducted by stake presidency members with **unit leaders**
- Each row: a presidency member interviewed a unit leader (Bishop, Branch President, Elders Quorum President) at a specific unit on a specific date/time and location
- Tied to **specific units** and **unit leadership**

#### `speaker-ministering.csv` — Stake Speaker Ministering Interviews

- **Columns:** `interviewee`, `stake_presidency_member`, `datetime`, `location`, `note`
- **41 rows** recording ministering interviews with **stake-level speakers** (auxiliary leaders, high councilors)
- These are **not tied to a specific unit** — they cover the stake speaker pool from `speakers.csv`
- Each row: a presidency member interviewed a stake speaker on a specific date/time at a specific location
- Complements `unit-ministering.csv`: one covers unit leaders, the other covers stake speakers

#### `stake_presidency_speaking_assignments.csv` — Stake Presidency Speaking Schedule

- **Columns:** `unit_id`, `month`, `stake_presidency_member`
- **18 rows** mapping which stake presidency member speaks at which unit in which month
- Each presidency member is assigned to speak at 3–4 units across the year
- Separate from stake-level speaking assignments (stake conference program)

#### `unit_provide_speakers.csv` — Unit Speaker Responsibility Schedule

- **Columns:** `unit_id`, `month`, `stake_presidency_member`
- **12 rows** mapping months to units — which unit is responsible for providing speakers during which month
- 6 units cycle through the year, each assigned to 2 months

### Relationships

```
units.csv (master list of 10 units)
  │
  ├─► speaking-assignments.csv      Links units → speakers on specific dates
  │     │                              (47 assignments across Jan–Dec 2026)
  │     └─► speakers.csv            Speaker directory (names for speaker IDs)
  │
  ├─► unit-ministering.csv          Links presidency members → units for
  │     (unit leader interviews)       ministering interviews with unit leaders
  │
  ├─► speaker-ministering.csv       Links presidency members → stake speakers
  │     (stake speaker interviews)     for ministering interviews (not unit-specific)
  │
  ├─► stake_presidency_speaking_assignments.csv
                                       Links presidency members → units for
                                       speaking engagements (by month)
  │
  └─► unit_provide_speakers.csv      Links units → months for speaker
  (speaker responsibility)             provision responsibility
```

**Key relationships:**

- **`units.csv`** is the central reference — all files referencing units use `unit_id` values from it
- **`speaking-assignments.csv`** connects **units** to **speakers** on specific dates, using `speaker_id` values resolved by `speakers.csv`
- **`unit-ministering.csv`** and **`speaker-ministering.csv`** are parallel ministering schedules:
  - `unit-ministering.csv` → presidency members interview **unit leaders** (tied to specific units)
  - `speaker-ministering.csv` → presidency members interview **stake speakers** (not tied to any unit)
- **`stake_presidency_speaking_assignments.csv`** tracks when presidency members are assigned to **speak at units**
- **`unit_provide_speakers.csv`** determines which unit is responsible for providing speakers in each month
