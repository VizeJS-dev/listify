import { enhanceTracks, isTrackEnhanced } from '@/types/track';
import type Track from '@/types/track';

function makeTrack(extra: Partial<Track> = {}): Track {
  return {
    id: 't1',
    name: 'Song',
    preview_url: 'https://audio/1.mp3',
    artists: [{ name: 'A' }],
    album: { images: [{ url: 'https://img/1.jpg' }] },
    uri: 'spotify:track:t1',
    ...extra,
  } as Track;
}

describe('enhanceTracks / isTrackEnhanced', () => {
  it('decorates tracks with kind, variant, badge and playable override', () => {
    const base: Track[] = [
      makeTrack({ id: '1', preview_url: 'p1' }),
      makeTrack({ id: '2', preview_url: undefined }),
      makeTrack({ id: '3', preview_url: 'p3' }),
      makeTrack({ id: '4', preview_url: 'p4' }),
    ];

    const enhanced = enhanceTracks(base);

    expect(enhanced).toHaveLength(4);

    // All are enhanced
    enhanced.forEach((t) => {
      expect(isTrackEnhanced(t)).toBe(true);
      expect(t.kind).toBe('enhanced');
      expect(t.variant).toBe('compact');
    });

    // Badge cycles new, hot, saved, new...
    expect(enhanced[0].badge).toBe('new');
    expect(enhanced[1].badge).toBe('hot');
    expect(enhanced[2].badge).toBe('saved');
    expect(enhanced[3].badge).toBe('new');

    // isPlayableOverride reflects existence of preview_url
    expect(enhanced[0].isPlayableOverride).toBe(true);
    expect(enhanced[1].isPlayableOverride).toBe(false);
  });
});
