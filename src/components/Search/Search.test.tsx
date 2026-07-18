import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '@/components/Search/Search';

describe('Search component', () => {
  it('should call onSearchChange with lowercase value', () => {
    const mockOnSearchChange = jest.fn();
    render(<Search onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    fireEvent.change(input, { target: { value: 'Pop' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('pop');
  });

  it('should clear query when input is empty', async () => {
    const mockOnSearchChange = jest.fn();
    render(<Search onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    
    fireEvent.change(input, { target: { value: 'Test' } });
    
    fireEvent.change(input, { target: { value: '' } });

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });
});