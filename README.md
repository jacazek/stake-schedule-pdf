# Durham Stake Schedules

This is a React-based web application that generates and displays speaking schedules and ministering interview schedules for a religious stake organization (likely LDS/Church of Jesus Christ of Latter-day Saints). The application creates PDF documents from JSON data sources.

## Key Features

1. **Two Main Schedules**:
   - Speaker schedules for stake council members
   - Unit schedules showing speaking assignments and ministering interviews for various wards and branches

2. **Data Sources**:
   - JSON files containing speaker and unit schedule data (`data/output/*.json`)
   - The data includes speaker assignments, ministering interviews, meeting dates, locations, and leadership information

3. **Technical Implementation**:
   - Built with React and TypeScript
   - Uses `@react-pdf/renderer` for PDF generation
   - Implements React Router for navigation between different schedule views
   - Responsive design with CSS styling
   - PDF viewer component for displaying generated documents

4. **Generated Content**:
   - Professional PDF documents with table of contents
   - Detailed speaker assignment schedules
   - Ministering interview instructions and guidelines
   - Unit-specific information including EQP meetings, leader meetings, and conference dates

5. **Project Structure**:
   - `src/` - Source code with components and pages
   - `data/output/` - JSON data files containing schedule information
   - `public/` - Static assets
   - `index.html` - Main HTML template

## Usage

The application allows users to view schedules for:
- Individual speakers and their assignments
- Units (wards and branches) and their speaking schedules
- Ministering interview schedules
- Instructions for speaking assignments and ministering visits

The data is organized by date, unit, and speaker, making it easy to find specific assignments. The PDF generation capability allows for professional printing and distribution of schedules.

This is a specialized application designed for organizational use within a religious stake to manage speaking assignments and ministering activities across multiple units.

## Prerequisites

- **Node.js** 24+ (earlier versions may work but untested)
- **Linux** (for the distributable): `libnss3`, `libnspr4`, `libasound2`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libcups2`, `libdrm2`, `libxkbcommon0`, `libxcomposite1`, `libxdamage1`, `libxrandr2`, `libgbm1`, `libpango-1.0-0`, `libcairo2`

On openSUSE, install Electron system dependencies with:
```bash
sudo zypper install -y libnss3 libnspr4 alsa-lib libatk1.0-0 libatk-bridge2.0-0 cups-libs libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2
```

## Install dependencies

```bash
npm install
```

## Run

### Web (development)

```bash
npm run dev
```

### Desktop (Electron, development)

```bash
npm run electron:dev
```

This starts the Vite dev server and launches the Electron app, which connects to the dev server with hot reload.

## Build

### Web

```bash
npm run build
```

### Desktop (Electron distributable)

```bash
npm run electron:build
```

This produces an AppImage in the `dist/` directory (e.g., `dist/pdf-test-0.0.0.AppImage`). The AppImage can be run directly on most Linux distributions.

## Clean

Remove all build artifacts:

```bash
npm run clean
```

This removes `dist/`, `electron/dist/`, and `dist-electron/`.

## Transforms
To prepare and transform CSV to json for web application, run following transforms from root of project.

Running transform will make backup of previous output.

### Speaker
Run `./data/speaker-transform.sh`

### Unit
Run `./data/unit-transform.sh`

## Data Processing Documentation
For detailed information about the transform scripts and mappers, please refer to the [data directory README](data/README.md).

