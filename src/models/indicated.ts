export interface Indicated {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralId: number | null;
  indicationDate: string;
  indicationStatus: 1 | 2;
}
