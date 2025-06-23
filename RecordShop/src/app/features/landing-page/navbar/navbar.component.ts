import { Component, Inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { DOCUMENT, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MusicShopService, SearchResult } from '../../../core/services/music-shop.service';
import { VinylContainer } from '../../../core/interfaces/vinyl.interface';

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
    // Urmărește schimbările de rută pentru a determina contextul
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  goToTop() {
    // Reset complete la navigarea la top
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
    console.log('=== RESETTING SEARCH STATE ===');
    this.searchedAlbums = [];
    this.search.clearSearch();
    this.search.clearSearchResults();
    console.log('Search state reset complete');
  }

  onSearch(term: string, inputEl: HTMLInputElement) {
    console.log('=== NEW SEARCH INITIATED ===');
    console.log('Search term:', term);
    console.log('Current route:', this.currentRoute);
    
    // Verifică dacă termenul este gol sau doar spații
    const trimmedTerm = (term || '').trim();
    if (!trimmedTerm) {
      console.log('Empty search term, clearing input');
      inputEl.value = '';
      return;
    }

    console.log('Trimmed search term:', trimmedTerm);
    
    // Determină contextul de căutare bazat pe ruta curentă
    if (this.currentRoute.includes('/home')) {
      this.searchOnHomePage(trimmedTerm, inputEl);
    } else if (this.currentRoute.includes('/shop')) {
      this.searchOnShopPage(trimmedTerm, inputEl);
    } else if (this.currentRoute.includes('/inventory')) {
      this.searchOnInventoryPage(trimmedTerm, inputEl);
    } else {
      // Pentru alte pagini, navighează la home și caută acolo
      this.searchOnHomePage(trimmedTerm, inputEl);
    }
    
    // Curăță input-ul în orice caz
    inputEl.value = '';
  }

  private searchOnHomePage(term: string, inputEl: HTMLInputElement) {
    console.log('=== SEARCHING ON HOME PAGE ===');
    
    // PRIMUL PAS: Reset complet al stării anterioare
    this.resetSearchState();
    
    // AL DOILEA PAS: Efectuează căutarea
    const results = this.search.searchAllProducts(term);
    console.log('Search results found:', results);
    
    if (results.length > 0) {
      console.log('=== SEARCH SUCCESSFUL ON HOME ===');
      console.log('Number of results:', results.length);
      
      // Setează rezultatele în serviciu
      this.search.setSearchResults(results);
      this.searchedAlbums = [...results]; // Copie locală
      
      // Setează titlul pentru afișare
      this.search.setTitle(term);
      
      // Navighează la home dacă nu este deja acolo
      if (!this.currentRoute.includes('/home')) {
        this.router.navigate(['/home']).then(() => {
          console.log('Navigation to home complete, scrolling to top');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        // Dacă suntem deja pe home, doar scroll la top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
    } else {
      console.log('=== NO RESULTS FOUND ON HOME ===');
      this.showNoResultsMessage(inputEl);
    }
  }

  private searchOnShopPage(term: string, inputEl: HTMLInputElement) {
    console.log('=== SEARCHING ON SHOP PAGE ===');
    
    // Emit eveniment pentru componenta shop să efectueze căutarea
    this.search.setTitle(term);
    
    // Găsește rezultatele pentru validare
    const results = this.search.searchAllProducts(term);
    
    if (results.length === 0) {
      this.showNoResultsMessage(inputEl);
    } else {
      console.log(`Found ${results.length} results for shop page`);
    }
  }

  private searchOnInventoryPage(term: string, inputEl: HTMLInputElement) {
    console.log('=== SEARCHING ON INVENTORY PAGE ===');
    
    // Emit eveniment pentru componenta inventory să efectueze căutarea
    this.search.setTitle(term);
    
    // Pentru pagina de inventory, căutarea va fi gestionată de componenta table
    console.log(`Inventory search term set: ${term}`);
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

  // DEBUG METHOD - ȘTERGE DUPĂ TESTARE
  debugSearch() {
    console.log('=== NAVBAR DEBUG ===');
    console.log('Current route:', this.currentRoute);
    console.log('Local searchedAlbums:', this.searchedAlbums.length);
    this.search.debugState();
    this.search.getCurrentSearchState();
  }
}