export interface MenuItem {
  id: number;
  title: string;
  desc: string | null;
  price: number;
}

export interface Reservation {
  id?: number;
  name: string;
  phone: string;
  date: string;
  people: number;
  status?: string;
}