import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrackCard from '@/components/blocks/track';
import type Track from '@/types/track';

// Kleine helper om snel een Track object te maken voor de tests
function makeTrack(extra: Partial<Track> = {}): Track {
  return {
    id: 'track_1',
    name: 'Test Track',
    preview_url: 'https://audio.example/preview.mp3',
    artists: [{ name: 'Artist A' }, { name: 'Artist B' }],
    album: { images: [{ url: 'https://images.example/cover.jpg' }] },
    uri: 'spotify:track:track_1',
    ...extra,
  } as Track;
}

describe('TrackCard component', () => {
  it('renders title, artists, cover and audio element', () => {
    const track = makeTrack();

    render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Artist A, Artist B')).toBeInTheDocument();

    // cover afbeelding (next/image is gemockt naar <img>)
    const img = screen.getByRole('img', { name: /test track/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('cover.jpg'));

    // audio tag aanwezig met juiste bron
    const audioEl = document.querySelector('audio');
    expect(audioEl).not.toBeNull();
    expect(audioEl).toHaveAttribute('src', track.preview_url!);
  });

  it('has a play/pause toggle (visible in both states)', () => {
    const track = makeTrack();

    const { rerender } = render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    // Als niet spelend is er een toggle aanwezig
    expect(screen.getByLabelText('Toggle play/pause')).toBeInTheDocument();

    // Als wel spelend is de toggle er ook (icoon is anders maar moeilijk te asserten)
    rerender(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={true}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Toggle play/pause')).toBeInTheDocument();
  });

  it('calls onPlayPause with trackId and audio element on click', () => {
    const track = makeTrack();
    const onPlayPause = jest.fn();

    render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={onPlayPause}
        onAudioEnded={jest.fn()}
      />
    );

    const toggle = screen.getByLabelText('Toggle play/pause');
    fireEvent.click(toggle);

    expect(onPlayPause).toHaveBeenCalledTimes(1);
    const [trackId, audioEl] = onPlayPause.mock.calls[0];
    expect(trackId).toBe(track.id);
    expect(audioEl).toBeInstanceOf(HTMLAudioElement);
  });

  it('calls onCardClick when clicking plus/minus icon', () => {
    const track = makeTrack();
    const onCardClick = jest.fn();

    const { rerender } = render(
      <TrackCard
        card={track}
        onCardClick={onCardClick}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    // Het plus/min icoon heeft class "cursor-pointer" en geen aria-label.
    // We pakken de laatste met die class (rechts staat ook de toggle met aria-label, die slaan we over).
    const icons = document.querySelectorAll('.cursor-pointer');
    const lastIcon = icons[icons.length - 1] as Element | null;
    if (lastIcon) {
      fireEvent.click(lastIcon);
    }
    expect(onCardClick).toHaveBeenCalledTimes(1);

    // Nu rerenderen met isAdded=true om het minus-icoon te tonen en nog een keer klikken
    rerender(
      <TrackCard
        card={track}
        onCardClick={onCardClick}
        isPlaying={false}
        isAdded
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );
    const icons2 = document.querySelectorAll('.cursor-pointer');
    const lastIcon2 = icons2[icons2.length - 1] as Element | null;
    if (lastIcon2) {
      fireEvent.click(lastIcon2);
    }
    expect(onCardClick).toHaveBeenCalledTimes(2);
  });
});

describe('TrackCard edge cases', () => {
  it('does not render play/pause when no preview_url', () => {
    const track = makeTrack({ preview_url: undefined as unknown as string });

    render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    expect(screen.queryByLabelText('Toggle play/pause')).toBeNull();

    // Audio element bestaat nog wel maar zonder src
    const audioEl = document.querySelector('audio');
    expect(audioEl).not.toBeNull();
    expect(audioEl).not.toHaveAttribute('src');
  });

  it('renders without cover image when album has no images', () => {
    const track = makeTrack({ album: { images: [] } as any });

    render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    // Geen <img> aanwezig als er geen cover is
    expect(screen.queryByRole('img', { name: /test track/i })).toBeNull();
  });

  it('calls onAudioEnded when audio ended event fires', () => {
    const track = makeTrack();
    const onAudioEnded = jest.fn();

    render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={onAudioEnded}
      />
    );

    const audioEl = document.querySelector('audio')!;
    // Ended event afvuren
    audioEl.dispatchEvent(new Event('ended'));

    expect(onAudioEnded).toHaveBeenCalledTimes(1);
  });

  it('triggers HTMLAudioElement.play/pause based on isPlaying prop', () => {
    const track = makeTrack();

    // Zorg dat bestaande mocks schoon zijn
    (HTMLMediaElement.prototype.play as jest.Mock).mockClear();
    (HTMLMediaElement.prototype.pause as jest.Mock).mockClear();

    // Mock de "paused" getter op het prototype zodat rerenders hetzelfde gedrag houden
    let pausedState = true;
    const pausedSpy = jest
      .spyOn(HTMLMediaElement.prototype, 'paused', 'get')
      .mockImplementation(() => pausedState);

    const { rerender } = render(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );

    // Start met niet spelend, zet dan naar spelend en verwacht play()
    rerender(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={true}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // Ga terug naar pauze en verwacht pause(); nu is paused=false
    (HTMLMediaElement.prototype.play as jest.Mock).mockClear();
    (HTMLMediaElement.prototype.pause as jest.Mock).mockClear();
    pausedState = false;

    rerender(
      <TrackCard
        card={track}
        onCardClick={jest.fn()}
        isPlaying={false}
        isAdded={false}
        onPlayPause={jest.fn()}
        onAudioEnded={jest.fn()}
      />
    );
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    pausedSpy.mockRestore();
  });
});
