import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';
import '@testing-library/jest-dom';
import FilterItem from '@/components/FilterItem/FilterItem';
import { TrackType } from '@/sharedTypes/sharedTypes';

const mockTracks: TrackType[] = [
  { _id: '1', name: 'Song 1', author: 'Artist A', genre: ['Pop'], release_date: '2023-01-01', duration_in_seconds: 180 },
  { _id: '2', name: 'Song 2', author: 'Artist B', genre: ['Rock'], release_date: '2022-05-15', duration_in_seconds: 200 },
];

describe('FilterItem component', () => {
  it('should open dropdown on button click', async () => {
    // 1. Создаем начальное состояние
    let isOpen = false;
    
    // Функция, которую мы передадим в onClick. 
    // В реальном приложении она меняет стейт родителя.
    const handleClick = () => {
      isOpen = !isOpen;
    };

    // Рендерим компонент с начальным состоянием (закрыт)
    const { rerender } = render(
      <FilterItem 
        title="исполнителю" 
        onClick={handleClick} 
        isOpen={isOpen} 
        currentValues={[]} 
        onSelect={jest.fn()} 
        playlist={mockTracks} 
      />
    );

    const button = screen.getByText('исполнителю');
    
    // Делаем клик. 
    // ВАЖНО: Клик только вызывает handleClick, который меняет переменную isOpen.
    // Сам компонент еще не обновился!
    await fireEvent.click(button);

    // 2. ЭМУЛИРУЕМ ОБНОВЛЕНИЕ РОДИТЕЛЯ:
    // Вызываем rerender с НОВЫМ значением isOpen (которое мы изменили в handleClick)
    rerender(
      <FilterItem 
        title="исполнителю" 
        onClick={handleClick} 
        isOpen={isOpen} // Теперь тут true!
        currentValues={[]} 
        onSelect={jest.fn()} 
        playlist={mockTracks} 
      />
    );

    // Теперь ждем, пока появится список (он появится, потому что isOpen=true)
    await waitFor(() => {
      expect(screen.getByTestId('filter-list')).toBeInTheDocument();
    });

    const listContainer = screen.getByTestId('filter-list');
    const artistAElement = await within(listContainer).findByText('Artist A');
    
    expect(artistAElement).toBeInTheDocument();
  });

  it('should select an option and trigger onSelect', async () => {
    const mockOnSelect = jest.fn();

    render(
      <FilterItem 
        title="исполнителю" 
        onClick={jest.fn()} 
        isOpen={true} 
        currentValues={[]} 
        onSelect={mockOnSelect} 
        playlist={mockTracks} 
      />
    );

    const listContainer = screen.getByTestId('filter-list');
    const option = await within(listContainer).findByText('Artist A');
    
    await fireEvent.click(option);
    expect(mockOnSelect).toHaveBeenCalledWith('Artist A');
  });
  
  it('should highlight selected item with "selected" class', async () => {
    render(
      <FilterItem 
        title="исполнителю" 
        onClick={jest.fn()} 
        isOpen={true} 
        currentValues={['Artist A']} 
        onSelect={jest.fn()} 
        playlist={mockTracks} 
      />
    );

    const listContainer = screen.getByTestId('filter-list');
    const selectedOption = await within(listContainer).findByText('Artist A');
    
    // Проверка класса для CSS Modules
    expect(selectedOption.className).toContain('selected');
  });
});