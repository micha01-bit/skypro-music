module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // УДАЛИ эту секцию globals полностью! Она больше не нужна.
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    // ИСПРАВЛЕНО: передаем конфиг ts-jest прямо сюда
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};