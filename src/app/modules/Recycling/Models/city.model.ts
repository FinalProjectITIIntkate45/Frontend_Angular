export interface City {
  id: number;
  name: string;
  governorateId: number;
}

// Sample cities data - you can expand this based on your needs
const citiesData: City[] = [
  { id: 1, name: 'Cairo', governorateId: 1 },
  { id: 2, name: 'Alexandria', governorateId: 2 },
  { id: 3, name: 'Giza', governorateId: 3 },
  { id: 4, name: 'Sharm El Sheikh', governorateId: 4 },
  { id: 5, name: 'Hurghada', governorateId: 5 },
  { id: 6, name: 'Luxor', governorateId: 6 },
  { id: 7, name: 'Aswan', governorateId: 7 },
  { id: 8, name: 'Port Said', governorateId: 8 },
  { id: 9, name: 'Suez', governorateId: 9 },
  { id: 10, name: 'Ismailia', governorateId: 10 }
];

export function getAllCities(): City[] {
  return [...citiesData];
}

export function getCitiesByGovernorate(governorateId: number): City[] {
  return citiesData.filter(city => city.governorateId === governorateId);
}

export function getCityById(id: number): City | undefined {
  return citiesData.find(city => city.id === id);
} 