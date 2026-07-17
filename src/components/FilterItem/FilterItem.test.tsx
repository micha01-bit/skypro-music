import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterItem from '@/components/FilterItem/FilterItem';
import { TrackType } from '@/sharedTypes/sharedTypes';

const mockTracks: TrackType[] = [
  { _id: '1', name: 'Song 1', author: 'Artist A', genre: ['Pop'], release_date: '2023-01-01', duration_in_seconds: 180 },
  { _id: '2', name: 'Song 2', author: 'Artist B', genre: ['Rock'], release_date: '2022-05-15', duration_in_seconds: 200 },
];

describe('FilterItem component', () => {
  it('should open dropdown on button click', () => {
    const mockOnClick = jest.fn();

    render(
      <FilterItem 
        title="исполнителю" 
        onClick={mockOnClick} 
        isOpen={false} 
        currentValues={[]} // Было: currentValue="", стало: пустой массив
        onSelect={jest.fn()} 
        playlist={mockTracks} 
      />
    );

    const button = screen.getByText('исполнителю');
    fireEvent.click(button);

    // Проверяем, что открылся дропдаун и в нём есть элементы
    expect(screen.queryByText('Artist A')).toBeInTheDocument();
    expect(mockOnClick).toHaveBeenCalledWith('исполнителю'); // Проверяем вызов onClick
  });

  it('should select an option and trigger onSelect', () => {
    const mockOnSelect = jest.fn();
    const mockOnClick = jest.fn();

    render(
      <FilterItem 
        title="исполнителю" 
        onClick={mockOnClick} 
        isOpen={true} 
        currentValues={[]} // Пустой массив = ничего не выбрано
        onSelect={mockOnSelect} 
        playlist={mockTracks} 
      />
    );

    const option = screen.getByText('Artist A');
    fireEvent.click(option);

    expect(mockOnSelect).toHaveBeenCalledWith('Artist A');
    
  });
  
  it('should highlight selected item with "selected" class', () => {
    render(
      <FilterItem 
        title="исполнителю" 
        onClick={jest.fn()} 
        isOpen={true} 
        currentValues={['Artist A']} // ✅ Передаем массив с выбранным элементом
        onSelect={jest.fn()} 
        playlist={mockTracks} 
      />
    );

    const selectedOption = screen.getByText('Artist A');
    expect(selectedOption).toHaveClass('filter__item selected');
  });
});