# Listify

Listify is a sophisticated web application that allows users to connect with Spotify to manage and display their
playlists in an intuitive dashboard.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Packages Used](#packages-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with Listify, you'll need to have Node.js and npm installed. Then, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/VizeJS-dev/listify.git
    cd listify
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Build the project:

    ```bash
    npm run build
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

## Features

- **Spotify Integration:** Connect your Spotify account to view and manage your playlists from within Listify.
- **Interactive Dashboard:** A modern and responsive dashboard to visualize your Spotify data.

## Packages Used

The project relies on several packages and libraries:

- `react`
- `react-dom`
- `postcss`
- `eslint`
- `@types/node`
- `typescript`
- `clsx: 2.1.1`
- `next: 14.2.11`
- `class-variance-authority: 0.7.0`
- `react-element-to-jsx-string: 15.0.0`
- `next-themes: 0.3.0`
- `@radix-ui/react-dropdown-menu: 2.1.1`
- `framer-motion: 11.5.4`
- `@types/react-dom`
- `eslint-config-next: 14.2.11`
- `@radix-ui/react-slot: 1.1.0`
- `@sentry/nextjs: 8.30.0`
- `@types/react`
- `lucide-react: 0.441.0`
- `tailwindcss-animate: 1.0.7`
- `@tabler/icons-react: 3.17.0`
- `tailwind-merge: 2.5.2`
- `tailwindcss: 3.4.1`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Tests

This project uses Jest + React Testing Library for unit and integration tests.

- To run the tests once:

```
npm test
```

- To run tests in watch mode during development:

```
npm run test:watch
```

- For CI (serial execution):

```
npm run test:ci
```

What’s covered now:
- Unit tests — `TrackCard` component:
  - Renders title, artists, cover and audio element (happy flow).
  - Play/pause toggle calls `onPlayPause` with `trackId` and audio element.
  - Add/remove icon calls `onCardClick`.
  - Edge cases: no `preview_url` (no toggle), no album image, `onAudioEnded` called on `ended`, and `isPlaying` drives `audio.play()`/`audio.pause()`.
- Unit tests — `Footer` component:
  - Renders three social links with images and accessible labels.
  - Each link opens in a new tab and uses `rel="noreferrer"` and is wrapped by a button for layout.
- Integration test — Home page (`src/app/page.tsx`):
  - Renders hero text, steps 1–4 with descriptions, the CTA link to `/login`, the theme toggle, and Footer links.
  - Test is deterministic by mocking animation/theming components (`AuroraBackground`, `ModeToggle`, `TextGenerateEffect`).

