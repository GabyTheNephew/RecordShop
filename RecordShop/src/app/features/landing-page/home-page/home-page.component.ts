import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(
    public search: MusicShopService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  get searchResults(): SearchResult[] {
    const title = this.search.title();
    if (!title || title.trim() === '') {
      return [];
    }
    
    const storedResults = this.search.getSearchResults();
    
    if (storedResults.length > 0) {
      return storedResults;
    }
    
    const freshResults = this.search.searchAllProducts(title.trim());
    
    if (freshResults.length > 0) {
      this.search.setSearchResults(freshResults);
    }
    
    return freshResults;
  }

  get hasSearchTerm(): boolean {
    const title = this.search.title();
    const hasSearch = !!(title && title.trim() !== '');

    if (hasSearch) {
      const results = this.searchResults;
    }
    
    return hasSearch;
  }

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