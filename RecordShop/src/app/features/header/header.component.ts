import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicShopService } from '../../core/services/music-shop.service';
import { VinylContainer } from '../../core/interfaces/vinyl.interface';
import { VinylComponent } from "../vinyl/vinyl.component";
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, VinylComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedAlbum!: string;
  searchInput: string = '';
  searchedAlbums: VinylContainer[] = [];
  constructor(public musicShopService: MusicShopService) { }

  searchAlbums() {
    this.searchedAlbums = this.musicShopService.searchAlbumByTitle(this.searchInput);
  }
}
