import { TrackType } from "@/sharedTypes/sharedTypes";


export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  const uniqueValues = new Set<string>();

  arr.forEach((item) => {
    const value = item[key];

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueValues.add(v);
        }
      });
    }

    else if (typeof value === 'string') {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues);
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : `${inputSeconds}`;

  return `${minutes}:${outputSeconds}`;
} 
 
export const getTimePanel = (
  currentTime: number,
  totalTime: number | undefined
) => {
  if (totalTime) {
    return `${formatTime(currentTime)} / ${formatTime(totalTime)}`
  }
} 
 
export const checkAccessToken = ():boolean => {
  // время жизни access токена в секундах
  const tokenLifetime = 200;

  const tokenGetTime = parseInt(localStorage.getItem("tokenGetTime") || "0", 10);

  // текущее время в секундах
  const currentTime = new Date().getTime() / 1000;

  const isAccessTokenExpired = Math.round(currentTime - tokenGetTime) >= tokenLifetime;

  return isAccessTokenExpired;
}