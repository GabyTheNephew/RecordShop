export interface SearchResult {
  id: string;
  text: string;
  price: number;
  image: string;
  type: 'vinyl' | 'cd';
  discImage?: string;
}