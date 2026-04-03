# OntomatchGame - Front

Main part of the OntomatchGame code.

[VueJs](https://vuejs.org/) and [Vite](https://vite.dev/) for build



## Project Setup

```sh
npm install
```

### Environment Configuration

This project uses environment-specific configuration files to manage different settings for development and production environments.

#### Environment Files

- **`.env.development`** - Used automatically when running `npm run dev`
  - Sets base URL to `/` (root path)
  - Points API to local development server

- **`.env.production`** - Used automatically when running `npm run build`
  - Sets base URL to `/ontomatchgame/` (subdirectory deployment)
  - Points API to production server

- **`.env.local`** *(optional, gitignored)* - For local overrides
  - Create this file to override settings without affecting other developers
  - This file is automatically ignored by git

#### Available Environment Variables

- `VITE_BASE_URL` - Base path for the application (e.g., `/` or `/ontomatchgame/`)
- `VITE_API_BASE_URL` - Backend API endpoint URL

#### Creating Local Overrides

If you need custom settings for your local environment:

```sh
# Create a local environment file
cp .env.development .env.local

# Edit .env.local with your custom values
# This file will not be committed to git
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

This automatically uses `.env.development` settings.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

This automatically uses `.env.production` settings.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
