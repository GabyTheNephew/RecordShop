import { Injectable, signal } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';
import { CdContainer } from '../interfaces/cd.interface';
import { CdContainers } from '../interfaces/cd-containers';

export interface SearchResult {
  id: string;
  text: string;
  price: number;
  image: string;
  type: 'vinyl' | 'cd';
  discImage?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class MusicShopService {
  
  public title = signal<string>('');
  private searchResults: SearchResult[] = [];
  private searchId: number = 0;

  listOfAlbums: VinylContainer[] = VinylContainers;
  listOfCds: CdContainer[] = CdContainers;
  currentUser$: any;

  constructor() {}

  searchAllProducts(searchTerm: string): SearchResult[] {
    this.searchId++;
    const currentSearchId = this.searchId;
    
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    const vinylResults = this.listOfAlbums.filter(vinyl => {
    const match = vinyl.text.toLowerCase().includes(term);
    return match;
    });

    vinylResults.forEach((vinyl, index) => {
      results.push({
        id: `vinyl-${currentSearchId}-${index}`,
        text: vinyl.text,
        price: vinyl.price,
        image: vinyl.image,
        type: 'vinyl',
        discImage: vinyl.discImage
      });
    });

    const cdResults = this.listOfCds.filter(cd => {
      const match = cd.text.toLowerCase().includes(term);
      return match;
    });

    cdResults.forEach((cd, index) => {
      results.push({
        id: `cd-${currentSearchId}-${index}`,
        text: cd.text,
        price: cd.price,
        image: cd.image,
        type: 'cd'
      });
    });

    // sort a-z
    const sortedResults = results.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    return sortedResults;
  }

  convertSearchResultsToVinyls(searchResults: SearchResult[]): VinylContainer[] {
    return searchResults
      .filter(result => result.type === 'vinyl')
      .map(result => ({
        text: result.text,
        price: result.price,
        image: result.image,
        discImage: result.discImage || 'vinyl-image.png'
      }));
  }

  setTitle(albumTitle: string) {
    const oldTitle = this.title();
    this.title.set(albumTitle);
  }

  search(term: string): boolean {
    if (!term || term.trim() === '') {
      return false;
    }
    const results = this.searchAllProducts(term);
    return results.length > 0;
  }

  setSearchResults(results: SearchResult[]): void {
    this.searchResults = [...results]; 
  }

  getSearchResults(): SearchResult[] {
    return [...this.searchResults];
  }

  clearSearchResults(): void {
    const oldCount = this.searchResults.length;
    this.searchResults = [];
  }

  clearSearch() {
    this.setTitle(''); 
    this.clearSearchResults();
  }

  getCurrentSearchState(): { title: string; resultsCount: number; results: SearchResult[] } {
    const state = {
      title: this.title(),
      resultsCount: this.searchResults.length,
      results: [...this.searchResults]
    };
    return state;
  }

}