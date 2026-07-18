// src/test-utils/renderWithProviders.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store'; // Путь к твоему стору
import type { RenderOptions } from '@testing-library/react';

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as renderWithProviders };

