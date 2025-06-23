import { Injectable, signal } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';
import { CdContainer } from '../interfaces/cd.interface';
import { CdContainers } from '../interfaces/cd-containers';

// Interface pentru rezultatele de căutare unificate
export interface SearchResult {
  id: string;
  text: string;
  price: number;
  image: string;
  type: 'vinyl' | 'cd';
  discImage?: string; // Doar pentru viniluri
}

@Injectable({
  providedIn: 'root'
})
export class MusicShopService {
  
  public title = signal<string>('');
  private searchResults: SearchResult[] = [];
  private searchId: number = 0; // Pentru tracking căutări

  listOfAlbums: VinylContainer[] = VinylContainers;
  listOfCds: CdContainer[] = CdContainers;
  currentUser$: any;

  constructor() {
    console.log('MusicShopService initialized');
    console.log('Available vinyls:', this.listOfAlbums.length);
    console.log('Available CDs:', this.listOfCds.length);
  }

  // Metoda originală pentru compatibilitate cu codul existent
  searchAlbumByTitle(albumTitle: string): VinylContainer[] {
    return this.listOfAlbums.filter((album) => 
      album.text.toLowerCase().includes(albumTitle.toLowerCase())
    );
  }

  // Noua metodă pentru căutare în ambele tipuri
  searchAllProducts(searchTerm: string): SearchResult[] {
    this.searchId++;
    const currentSearchId = this.searchId;
    
    console.log(`=== SEARCH ${currentSearchId} START ===`);
    console.log('Search term:', searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
      console.log(`Search ${currentSearchId}: Empty term, returning empty array`);
      return [];
    }

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Caută în viniluri
    console.log(`Search ${currentSearchId}: Searching in vinyls...`);
    const vinylResults = this.listOfAlbums.filter(vinyl => {
      const match = vinyl.text.toLowerCase().includes(term);
      if (match) {
        console.log(`Search ${currentSearchId}: Vinyl match found:`, vinyl.text);
      }
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

    // Caută în CD-uri
    console.log(`Search ${currentSearchId}: Searching in CDs...`);
    const cdResults = this.listOfCds.filter(cd => {
      const match = cd.text.toLowerCase().includes(term);
      if (match) {
        console.log(`Search ${currentSearchId}: CD match found:`, cd.text);
      }
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

    // Sortează rezultatele alfabetic
    const sortedResults = results.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    
    console.log(`Search ${currentSearchId}: Total results found:`, sortedResults.length);
    sortedResults.forEach((result, index) => {
      console.log(`Search ${currentSearchId}: Result ${index + 1}: ${result.text} (${result.type})`);
    });
    
    console.log(`=== SEARCH ${currentSearchId} END ===`);
    return sortedResults;
  }

  // Convertește SearchResult înapoi la VinylContainer pentru compatibilitate
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
    console.log('Title changed from:', `"${oldTitle}"`, 'to:', `"${albumTitle}"`);
  }

  search(term: string): boolean {
    if (!term || term.trim() === '') {
      return false;
    }
    const results = this.searchAllProducts(term);
    return results.length > 0;
  }

  // Metodă pentru a seta rezultatele căutării
  setSearchResults(results: SearchResult[]): void {
    console.log('Setting search results. Old count:', this.searchResults.length, 'New count:', results.length);
    this.searchResults = [...results]; // Creează o copie nouă
    console.log('Search results set successfully. Current count:', this.searchResults.length);
  }

  // Metodă pentru a obține rezultatele căutării
  getSearchResults(): SearchResult[] {
    console.log('Getting search results. Count:', this.searchResults.length);
    return [...this.searchResults]; // Returnează o copie
  }

  // Metodă pentru a curăța rezultatele căutării
  clearSearchResults(): void {
    const oldCount = this.searchResults.length;
    this.searchResults = [];
    console.log('Search results cleared. Old count:', oldCount, 'New count:', this.searchResults.length);
  }

  // Metodă îmbunătățită pentru curățare completă
  clearSearch() {
    console.log('=== CLEARING SEARCH COMPLETELY ===');
    console.log('Before clear - Title:', `"${this.title()}"`, 'Results:', this.searchResults.length);
    
    this.setTitle(''); 
    this.clearSearchResults();
    
    console.log('After clear - Title:', `"${this.title()}"`, 'Results:', this.searchResults.length);
    console.log('=== SEARCH CLEARED ===');
  }

  // Metodă pentru debug
  getCurrentSearchState(): { title: string; resultsCount: number; results: SearchResult[] } {
    const state = {
      title: this.title(),
      resultsCount: this.searchResults.length,
      results: [...this.searchResults]
    };
    console.log('Current search state:', state);
    return state;
  }

  // Metodă pentru debug complet
  debugState(): void {
    console.log('=== DEBUG MUSIC SHOP SERVICE STATE ===');
    console.log('Title:', `"${this.title()}"`);
    console.log('Search results count:', this.searchResults.length);
    console.log('Search results:', this.searchResults);
    console.log('Available data:');
    console.log('- Vinyls:', this.listOfAlbums.length);
    console.log('- CDs:', this.listOfCds.length);
    console.log('=== END DEBUG ===');
  }
}