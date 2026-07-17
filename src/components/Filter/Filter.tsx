'use client';

import styles from './filter.module.css'; 
import FilterItem from '../FilterItem/FilterItem';
import { useState } from 'react'; 
import { TrackType } from '@/sharedTypes/sharedTypes';

type FiltersState = {
  author?: string[];
  genre?: string[];
  year?: string[];
};

type FilterProp = {
  playlist: TrackType[]
  onFiltersChange: (filters: FiltersState) => void
  currentFilters: FiltersState
};
 
export default function Filter({ playlist, onFiltersChange, currentFilters }: FilterProp) { 
  const [isOpen, setIsOpen] = useState("");
  
  const onOpenDropdownList = (title: string) => {
    setIsOpen(title === isOpen ? "" : title);
  };  

  // Вспомогательная функция для переключения элемента в массиве
  const toggleFilterValue = (key: keyof FiltersState, value: string) => {
    const current = currentFilters[key] || [];
    
    if (current.includes(value)) {
      // Если уже выбрано - удаляем
      onFiltersChange({
        ...currentFilters,
        [key]: current.filter(v => v !== value)
      });
    } else {
      // Если не выбрано - добавляем
      onFiltersChange({
        ...currentFilters,
        [key]: [...current, value]
      });
    }
  };
   
  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div> 
      
      <FilterItem
        title="исполнителю"
        onClick={onOpenDropdownList}
        isOpen={isOpen === "исполнителю"}
        // Передаем массив выбранных авторов
        currentValues={currentFilters.author} 
        onSelect={val => toggleFilterValue('author', val)}
        playlist={playlist}
      />
      
      <FilterItem
        title="году выпуска"
        onClick={onOpenDropdownList}
        isOpen={isOpen === "году выпуска"}
        // Передаем массив выбранных лет
        currentValues={currentFilters.year} 
        onSelect={val => toggleFilterValue('year', val)}
        playlist={playlist}
      />
      
      <FilterItem
        title="жанру"
        onClick={onOpenDropdownList}
        isOpen={isOpen === "жанру"}
        // Передаем массив выбранных жанров
        currentValues={currentFilters.genre} 
        onSelect={val => toggleFilterValue('genre', val)}
        playlist={playlist}
      />
    </div>
  )
}