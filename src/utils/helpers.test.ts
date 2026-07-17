import { formatTime, getTimePanel, getUniqueValuesByKey, checkAccessToken } from '@/utils/helpers';
import { TrackType } from '@/sharedTypes/sharedTypes';

describe('formatTime function', () => {
  it('should format seconds to MM:SS correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(59)).toBe('0:59');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3661)).toBe('61:01');
  });
});

describe('getTimePanel function', () => {
  it('should return formatted time panel string', () => {
    expect(getTimePanel(120, 300)).toBe('2:00 / 5:00');
    expect(getTimePanel(0, undefined)).toBeUndefined();
  });
});

describe('getUniqueValuesByKey function', () => {
  const tracks: TrackType[] = [
    { _id: '1', name: 'T1', author: 'A1', genre: ['G1', 'G2'], release_date: '2020-01-01', duration_in_seconds: 100 },
    { _id: '2', name: 'T2', author: 'A2', genre: ['G2', 'G3'], release_date: '2021-02-02', duration_in_seconds: 120 },
    { _id: '3', name: 'T3', author: 'A1', genre: 'G4', release_date: '2022-03-03', duration_in_seconds: 140 },
  ];

  it('should extract unique authors', () => {
    const result = getUniqueValuesByKey(tracks, 'author');
    expect(result).toEqual(expect.arrayContaining(['A1', 'A2']));
    expect(result.length).toBe(2);
  });

  it('should extract unique genres from arrays and strings', () => {
    const result = getUniqueValuesByKey(tracks, 'genre');
    expect(result).toEqual(expect.arrayContaining(['G1', 'G2', 'G3', 'G4']));
    expect(result.length).toBe(4);
  });

  it('should handle empty array', () => {
    expect(getUniqueValuesByKey([], 'author')).toEqual([]);
  });
});

describe('checkAccessToken function', () => {
  beforeEach(() => {
    jest.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'tokenGetTime') {
        return String(Math.floor(Date.now() / 1000));
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return false if token is not expired', () => {
    // Токен получен сейчас — не истёк
    expect(checkAccessToken()).toBe(false);
  });

  it('should return true if token is expired', () => {
    const mockTime = Math.floor(Date.now() / 1000) - 300; // 5 минут назад
    jest.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'tokenGetTime') return String(mockTime);
      return null;
    });
    expect(checkAccessToken()).toBe(true);
  });
});
