import { Injectable, signal } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicShopService {
  public title = signal<string>('');

  listOfAlbums: VinylContainer[] = VinylContainers;

  searchAlbumByTitle(albumTitle: string): VinylContainer[] {
    return this.listOfAlbums.filter((album) => album.text.toLowerCase().includes(albumTitle.toLowerCase()));
  }

  setTitle(albumTitle: string) {
    this.title.set(albumTitle);
  }

}
