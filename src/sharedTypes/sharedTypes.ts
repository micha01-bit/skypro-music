export type TrackType = {
  _id: string;
  name: string;
  author: string; // Можно тоже сделать author?: string для безопасности
  release_date: string;
  genre: string | string[];
  duration_in_seconds: number;
  
  // Добавляем "?" чтобы эти поля могли отсутствовать
  album?: string;           
  logo?: string | null;      
  track_file?: string;      
  stared_user?: string[];    
};

export type CategoryType = {
  _id: number;
  items: number[]; 
  name: string;
};