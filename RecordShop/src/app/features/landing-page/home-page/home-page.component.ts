import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { VinylListComponent } from "../vinyl-list/vinyl-list.component";
import { CdListComponent } from "../cd-list/cd-list.component";
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from '../navbar/navbar.component';
import { VinylComponent } from '../vinyl/vinyl.component';
import { CdComponent } from '../cd/cd.component';
import { MusicShopService, SearchResult } from '../../../core/services/music-shop.service';
import { CommonModule } from '@angular/common';
import { VinylContainer } from '../../../core/interfaces/vinyl.interface';
import { CdContainer } from '../../../core/interfaces/cd.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent, 
    VinylListComponent, 
    CdListComponent, 
    FooterComponent, 
    NavbarComponent, 
    VinylComponent, 
    CdComponent,
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(public search: MusicShopService) {}

  get searchResults(): SearchResult[] {
    const title = this.search.title();
    if (title && title.trim() !== '') {
      // Returnează rezultatele mixte stocate în serviciu
      const storedResults = this.search.getSearchResults();
      if (storedResults.length > 0) {
        return storedResults;
      }
      
      // Fallback la căutarea în toate produsele
      return this.search.searchAllProducts(title);
    }
    return [];
  }

  get hasSearchTerm(): boolean {
    const title = this.search.title();
    return !!(title && title.trim() !== '');
  }

  // Helper methods pentru type casting
  getVinylData(result: SearchResult): VinylContainer {
    const discImage = result.discImage || 'vinyl-image.png';
    return {
      text: result.text,
      price: result.price,
      image: result.image,
      discImage: discImage
    };
  }

  getCdData(result: SearchResult): CdContainer {
     const discImage = result.discImage || 'cd-image.png';
    return {
      text: result.text,
      price: result.price,
      image: result.image,
      cdImage: discImage
    };
  }

  onProductSelect(productName: string) {
    this.search.setTitle(productName);
  }
}