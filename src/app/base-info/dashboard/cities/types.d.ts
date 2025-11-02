/**
 * * CityType → Strongly typed model for city entities
 */
type CityType = {
  id: number;
  province: ProvinceType | null;
  // code: string
  name: string;
};
