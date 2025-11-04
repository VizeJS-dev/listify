import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Footer from '@/components/ui/footer';

// De footer heeft 3 social media links. We checken of ze er zijn en of de urls kloppen.
describe('Footer component', () => {
  it('renders 3 social links with image and label', () => {
    render(<Footer />);

    // Alle <a> links in de footer
    const linkEls = screen.getAllByRole('link');
    expect(linkEls).toHaveLength(3);

    // Verwachte hrefs in dezelfde volgorde
    const hrefs = linkEls.map((a) => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toEqual([
      'https://github.com/VizeJS-dev',
      'https://www.linkedin.com/in/garik-sandrosyan-5b010a2b3/',
      'https://www.instagram.com/garik.sandros/',
    ]);

    // Elk linkje heeft een image met alt="icons"
    const imageEls = screen.getAllByAltText('icons');
    expect(imageEls).toHaveLength(3);

    // Er is een sr-only label per profiel
    expect(screen.getByText('Social media profile 1')).toBeInTheDocument();
    expect(screen.getByText('Social media profile 2')).toBeInTheDocument();
    expect(screen.getByText('Social media profile 3')).toBeInTheDocument();
  });

  it('uses proper target and rel attributes and wraps links in buttons', () => {
    render(<Footer />);

    // Er zijn precies 3 knoppen die de links omsluiten
    const buttonEls = screen.getAllByRole('button');
    expect(buttonEls).toHaveLength(3);

    // Elke knop bevat precies één anchor met _blank en noreferrer
    buttonEls.forEach((btn) => {
      const anchor = within(btn).getByRole('link') as HTMLAnchorElement;
      expect(anchor.target).toBe('_blank');
      expect(anchor.rel).toContain('noreferrer');
    });
  });
});
