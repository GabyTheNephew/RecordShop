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

  listOfAlbums: VinylContainer[] = VinylContainers;
  listOfCds: CdContainer[] = CdContainers;

  // Metoda originală pentru compatibilitate cu codul existent
  searchAlbumByTitle(albumTitle: string): VinylContainer[] {
    return this.listOfAlbums.filter((album) => 
      album.text.toLowerCase().includes(albumTitle.toLowerCase())
    );
  }

  // Noua metodă pentru căutare în ambele tipuri
  searchAllProducts(searchTerm: string): SearchResult[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Caută în viniluri
    const vinylResults = this.listOfAlbums.filter(vinyl => 
      vinyl.text.toLowerCase().includes(term)
    );

    vinylResults.forEach((vinyl, index) => {
      results.push({
        id: `vinyl-${index}`,
        text: vinyl.text,
        price: vinyl.price,
        image: vinyl.image,
        type: 'vinyl',
        discImage: vinyl.discImage
      });
    });

    // Caută în CD-uri
    const cdResults = this.listOfCds.filter(cd => 
      cd.text.toLowerCase().includes(term)
    );

    cdResults.forEach((cd, index) => {
      results.push({
        id: `cd-${index}`,
        text: cd.text,
        price: cd.price,
        image: cd.image,
        type: 'cd'
      });
    });

    // Sortează rezultatele alfabetic
    return results.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
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
    this.title.set(albumTitle);
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
    this.searchResults = results;
  }

  // Metodă pentru a obține rezultatele căutării
  getSearchResults(): SearchResult[] {
    return this.searchResults;
  }

  // Metodă pentru a curăța rezultatele căutării
  clearSearchResults(): void {
    this.searchResults = [];
  }

  clearSearch() {
    this.setTitle(''); 
    this.clearSearchResults();
  }
}