import { screen, fireEvent, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import '@testing-library/jest-dom';
import Centerblock from '@/components/Centerblock/Centerblock';
import { TrackType } from '@/sharedTypes/sharedTypes';

const mockTracks: TrackType[] = [
  { _id: '1', name: 'Amazing Song', author: 'Artist A', genre: ['Pop'], release_date: '2023-12-01', duration_in_seconds: 180 },
  { _id: '2', name: 'Best Track', author: 'Artist B', genre: ['Rock'], release_date: '2022-06-15', duration_in_seconds: 200 },
  { _id: '3', name: 'Cool Melody', author: 'Artist A', genre: ['Jazz'], release_date: '2023-03-10', duration_in_seconds: 190 },
];

describe('Centerblock component', () => {
  it('should filter by author', async () => {
    renderWithProviders(
      <Centerblock categoryName="Test" playlist={mockTracks} isLoading={false} error="" isAuthRequired={false} />
    );
    
    const filterButton = screen.getByText('исполнителю');
    await fireEvent.click(filterButton);

    // Ждем появления списка через waitFor. Это убирает ошибки act и гарантирует наличие элемента.
    await waitFor(() => {
      const listContainer = document.querySelector('.filter__list');
      expect(listContainer).toBeInTheDocument();
      return listContainer as HTMLElement;
    });

    const listContainer = document.querySelector('.filter__list') as HTMLElement;

    const artistAOption = await within(listContainer).findByText('Artist A');
    await fireEvent.click(artistAOption);

    expect(screen.queryByText('Best Track')).not.toBeInTheDocument();
    expect(await screen.findByText('Amazing Song')).toBeInTheDocument();
  });

  it('should search by name (prefix match)', async () => {
    renderWithProviders(
      <Centerblock categoryName="Test" playlist={mockTracks} isLoading={false} error="" isAuthRequired={false} />
    );
    
    const searchInput = screen.getByPlaceholderText('Поиск');
    await fireEvent.change(searchInput, { target: { value: 'Am' } });

    expect(await screen.findByText('Amazing Song')).toBeInTheDocument();
    expect(screen.queryByText('Best Track')).not.toBeInTheDocument();
  });

  it('should show "Нет подходящих треков" when no matches', async () => {
    renderWithProviders(
      <Centerblock categoryName="Test" playlist={mockTracks} isLoading={false} error="" isAuthRequired={false} />
    );
    
    const searchInput = screen.getByPlaceholderText('Поиск');
    await fireEvent.change(searchInput, { target: { value: 'NonExistingTrack' } });

    expect(await screen.findByText('Нет подходящих треков')).toBeInTheDocument();
  });

  it('should reset filters when playlist changes', async () => {
     const { rerender } = renderWithProviders(
      <Centerblock 
        categoryName="Test" 
        playlist={mockTracks} 
        isLoading={false} 
        error="" 
        isAuthRequired={false} 
      />
    );

    const filterButton = screen.getByText('исполнителю');
    await fireEvent.click(filterButton);
    
    await waitFor(() => {
        const listContainer = document.querySelector('.filter__list');
        expect(listContainer).toBeInTheDocument();
        return listContainer as HTMLElement;
    });

    const listContainer = document.querySelector('.filter__list') as HTMLElement;
    const artistAOption = await within(listContainer).findByText('Artist A');
    await fireEvent.click(artistAOption);
    
    expect(screen.queryByText('Best Track')).not.toBeInTheDocument();

    rerender(
      <Centerblock 
        categoryName="Test" 
        playlist={[...mockTracks, { _id: '4', name: 'New Song', author: 'Artist C', genre: ['Electronic'], release_date: '2024-01-01', duration_in_seconds: 210 }]} 
        isLoading={false} 
        error="" 
        isAuthRequired={false} 
      />
    );

    // После ререндера фильтры должны сброситься, поэтому Best Track снова виден
    expect(await screen.findByText('Best Track')).toBeInTheDocument();
  });
});