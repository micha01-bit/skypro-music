import '@testing-library/jest-dom';

// Глобальный мок для localStorage
const localStorageMock = {
  getItem: jest.fn((key: string) => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
} as unknown as Storage;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});