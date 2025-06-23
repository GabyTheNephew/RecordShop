import { Component, Inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { DOCUMENT, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MusicShopService, SearchResult } from '../../../core/services/music-shop.service';

@Component({
  selector   : 'app-navbar',
  standalone : true,
  imports    : [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.scss']
})
export class NavbarComponent {
  searchedAlbums: SearchResult[] = [];
  currentRoute: string = '';

  constructor(
    private router : Router,
    public  search : MusicShopService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  goToTop() {
    this.resetSearchState();
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goToVinyls() {
    this.router.navigate(['/home']).then(() => {
      this.scrollToSection('vinyl-section');
    });
  }

  goToCDs() {
    this.router.navigate(['/home']).then(() => {
      this.scrollToSection('cd-section');
    });
  }

  private scrollToSection(sectionId: string) {
    setTimeout(() => {
      const element = this.doc.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  goToAll() {
    this.resetSearchState();
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private resetSearchState() {
    this.searchedAlbums = [];
    this.search.clearSearch();
    this.search.clearSearchResults();
  }

  onSearch(term: string, inputEl: HTMLInputElement) {
       const trimmedTerm = (term || '').trim();
    if (!trimmedTerm) {
      inputEl.value = '';
      return;
    }

        if (this.currentRoute.includes('/home')) {
      this.searchOnHomePage(trimmedTerm, inputEl);
    } else if (this.currentRoute.includes('/shop')) {
      this.searchOnShopPage(trimmedTerm, inputEl);
    } else if (this.currentRoute.includes('/inventory')) {
      this.searchOnInventoryPage(trimmedTerm, inputEl);
    } else {
      this.searchOnHomePage(trimmedTerm, inputEl);
    }
    
    inputEl.value = '';
  }

  private searchOnHomePage(term: string, inputEl: HTMLInputElement) {
   
    this.resetSearchState();
    
    const results = this.search.searchAllProducts(term);
    
    if (results.length > 0) {
      this.search.setSearchResults(results);
      this.searchedAlbums = [...results]; 
      
      this.search.setTitle(term);
      
      if (!this.currentRoute.includes('/home')) {
        this.router.navigate(['/home']).then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
    } else {
      this.showNoResultsMessage(inputEl);
    }
  }

  private searchOnShopPage(term: string, inputEl: HTMLInputElement) {
    this.search.setTitle(term);
    
    const results = this.search.searchAllProducts(term);
    
    if (results.length === 0) {
      this.showNoResultsMessage(inputEl);
    }
  }

  private searchOnInventoryPage(term: string, inputEl: HTMLInputElement) {
    
    this.search.setTitle(term);
  }

  private showNoResultsMessage(inputEl: HTMLInputElement) {
    inputEl.value = '';
    inputEl.placeholder = 'NO RESULTS';
    inputEl.classList.add('no-result');
    
    setTimeout(() => {
      inputEl.placeholder = 'Search albums, artists...';
      inputEl.classList.remove('no-result');
    }, 2000);
  }
}