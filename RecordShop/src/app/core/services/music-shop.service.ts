import { Injectable, signal } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicShopService {
  
  public title = signal<string>('');
  private searchResults: VinylContainer[] = [];

  listOfAlbums: VinylContainer[] = VinylContainers;

  searchAlbumByTitle(albumTitle: string): VinylContainer[] {
    return this.listOfAlbums.filter((album) => album.text.toLowerCase().includes(albumTitle.toLowerCase()));
  }

  setTitle(albumTitle: string) {
    this.title.set(albumTitle);
  }

  search(term: string): boolean {
    if (!term || term.trim() === '') {
      return false;
    }
    const results = this.searchAlbumByTitle(term);
    return results.length > 0;
  }

  // Metodă pentru a seta rezultatele căutării
  setSearchResults(results: VinylContainer[]): void {
    this.searchResults = results;
  }

  // Metodă pentru a obține rezultatele căutării
  getSearchResults(): VinylContainer[] {
    return this.searchResults;
  }

  // Metodă pentru a curăța rezultatele căutării
  clearSearchResults(): void {
    this.searchResults = [];
  }
  clearSearch() {
  this.setTitle(''); // sau this.title.set('') dacă folosești signal
  // Curăță și alte proprietăți legate de căutare dacă există
}
}