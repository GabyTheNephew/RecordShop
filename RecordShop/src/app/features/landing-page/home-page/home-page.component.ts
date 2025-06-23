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

  ngOnInit() {
    console.log('HomePageComponent initialized');
  }

  ngOnDestroy() {
    console.log('HomePageComponent destroyed');
  }

  get searchResults(): SearchResult[] {
    const title = this.search.title();
    
    console.log('=== HOME PAGE: Getting search results ===');
    console.log('Current title:', `"${title}"`);
    
    // Dacă nu există termen de căutare, returnează array gol
    if (!title || title.trim() === '') {
      console.log('No search title, returning empty results');
      return [];
    }
    
    // Încearcă să obții rezultatele din serviciu
    const storedResults = this.search.getSearchResults();
    console.log('Stored results count:', storedResults.length);
    
    // Dacă există rezultate stocate, le returnează
    if (storedResults.length > 0) {
      console.log('Returning stored results:', storedResults.length);
      return storedResults;
    }
    
    // Fallback: efectuează o căutare nouă
    console.log('No stored results, performing new search for:', title);
    const freshResults = this.search.searchAllProducts(title.trim());
    console.log('Fresh search results:', freshResults.length);
    
    // Stochează rezultatele pentru utilizare ulterioară
    if (freshResults.length > 0) {
      this.search.setSearchResults(freshResults);
    }
    
    return freshResults;
  }

  get hasSearchTerm(): boolean {
    const title = this.search.title();
    const hasSearch = !!(title && title.trim() !== '');
    
    console.log('=== HOME PAGE: Checking if has search term ===');
    console.log('Title:', `"${title}"`);
    console.log('Has search term:', hasSearch);
    
    if (hasSearch) {
      const results = this.searchResults;
      console.log('Search results count:', results.length);
    }
    
    return hasSearch;
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
    console.log('Product selected:', productName);
    this.search.setTitle(productName);
  }

  // Metodă pentru debug manual
  debugCurrentState() {
    console.log('=== HOME PAGE DEBUG ===');
    console.log('Title:', this.search.title());
    console.log('Has search term:', this.hasSearchTerm);
    console.log('Search results:', this.searchResults);
    this.search.debugState();
  }
}