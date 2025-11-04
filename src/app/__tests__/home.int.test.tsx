import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock de UI componenten die animaties of theming gebruiken zodat de integratietest stabiel en herhaalbaar is.
jest.mock('@/components/ui/aurora-background', () => ({ AuroraBackground: ({ children }: any) => <div data-testid="aurora-bg">{children}</div> }));
jest.mock('@/components/ui/theme-toggle', () => ({ ModeToggle: () => <button aria-label="Toggle theme" /> }));
jest.mock('@/components/ui/text-generate-effect', () => ({ TextGenerateEffect: ({ words }: { words: string }) => <h1>{words}</h1> }));

import Home from '@/app/page';

// Integratietest voor de homepage compositie.
describe('Home page integration', () => {
  it('renders hero, steps, CTA, theme toggle and footer links', () => {
    render(<Home />);

    // Hero titel (mocked component toont de tekst letterlijk)
    expect(screen.getByRole('heading', { name: /welcome to\s+listify!/i })).toBeInTheDocument();

    // De vier stappen worden getoond
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Log in to your Spotify account to begin.')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Browse and discover music by your favorite artists.')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Create and organize a playlist with your selected songs.')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
    expect(screen.getByText('Share your playlists with friends and enjoy the music together.')).toBeInTheDocument();

    // CTA link naar /login bestaat met juiste tekst
    const cta = screen.getByRole('link', { name: /connect your spotify/i });
    expect(cta).toHaveAttribute('href', '/login');

    // Theme toggle (gemockt als knop) is aanwezig
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();

    // Footer social links (3 stuks met juiste hrefs)
    const links = screen.getAllByRole('link');
    const hrefs = links.map((a) => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining([
      'https://github.com/VizeJS-dev',
      'https://www.linkedin.com/in/garik-sandrosyan-5b010a2b3/',
      'https://www.instagram.com/garik.sandros/',
      '/login',
    ]));
  });
});
