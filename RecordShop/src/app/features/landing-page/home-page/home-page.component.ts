import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { VinylListComponent } from "../vinyl-list/vinyl-list.component";
import { CdListComponent } from "../cd-list/cd-list.component";
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from '../navbar/navbar.component';
import { VinylComponent } from '../vinyl/vinyl.component'; // ADAUGĂ ASTA
import { MusicShopService } from '../../../core/services/music-shop.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, VinylListComponent, CdListComponent, FooterComponent, NavbarComponent, VinylComponent, CommonModule], // ADAUGĂ VinylComponent
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
cds: any;
vinyls: any;
  constructor(public search: MusicShopService) {}

  get searchResults() {
    const title = this.search.title();
    if (title && title.trim() !== '') {
      return this.search.searchAlbumByTitle(title);
    }
    return [];
  }

  get hasSearchTerm() {
    const title = this.search.title();
    return title && title.trim() !== '';
  }
}