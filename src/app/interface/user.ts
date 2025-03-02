export type IUserName = {
  firstName: string;
  lastName: string;
};

export const DISTRICTS = [
  'bagerhat',
  'bandarban',
  'barguna',
  'barisal',
  'bhola',
  'bogura',
  'brahmanbaria',
  'chandpur',
  'chapainawabganj',
  'chattogram',
  'chuadanga',
  'comilla',
  "cox's bazar",
  'dhaka',
  'dinajpur',
  'faridpur',
  'feni',
  'gaibandha',
  'gazipur',
  'gopalganj',
  'habiganj',
  'jamalpur',
  'jashore',
  'jhalokathi',
  'jhenaidah',
  'joypurhat',
  'khagrachhari',
  'khulna',
  'kishoreganj',
  'kurigram',
  'kushtia',
  'lakshmipur',
  'lalmonirhat',
  'madaripur',
  'magura',
  'manikganj',
  'meherpur',
  'moulvibazar',
  'munshiganj',
  'mymensingh',
  'naogaon',
  'narail',
  'narayanganj',
  'narsingdi',
  'natore',
  'netrokona',
  'nilphamari',
  'noakhali',
  'pabna',
  'panchagarh',
  'patuakhali',
  'pirojpur',
  'rajbari',
  'rajshahi',
  'rangamati',
  'rangpur',
  'satkhira',
  'shariatpur',
  'sherpur',
  'sirajganj',
  'sunamganj',
  'sylhet',
  'tangail',
  'thakurgaon',
] as const;

export const DIVISIONS = [
  'barisal',
  'chattogram',
  'dhaka',
  'khulna',
  'mymensingh',
  'rajshahi',
  'rangpur',
  'sylhet',
] as const;

export interface IUserAddress {
  street: string;
  city: ICity;
  district: TDistrict;
  zipCode: string;
}

export type TDistrict = (typeof DISTRICTS)[number];
export type ICity = (typeof DIVISIONS)[number];
