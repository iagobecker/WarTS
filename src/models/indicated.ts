export interface Indicated {
  id: string;
  name: string;
  email: string;
  phone: string;
  referredByName: string;
  referralId: number | null | string;
  indicationDate: string;
  indicationStatus: 1 | 2;
}
