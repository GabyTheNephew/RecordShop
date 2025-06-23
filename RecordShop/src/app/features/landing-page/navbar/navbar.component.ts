import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT, CommonModule } from '@angular/common';
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

  constructor(
    private router : Router,
    public  search : MusicShopService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

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
    
    // PRIMUL PAS: Reset complet al stării anterioare
    this.resetSearchState();
    
    // Verifică dacă termenul este gol sau doar spații
    const trimmedTerm = (term || '').trim();
    if (!trimmedTerm) {
      console.log('Empty search term, clearing input');
      inputEl.value = '';
      return;
    }

    console.log('Trimmed search term:', trimmedTerm);
    
    // AL DOILEA PAS: Efectuează căutarea
    const results = this.search.searchAllProducts(trimmedTerm);
    console.log('Search results found:', results);
    
    if (results.length > 0) {
      console.log('=== SEARCH SUCCESSFUL ===');
      console.log('Number of results:', results.length);
      
      // Setează rezultatele în serviciu
      this.search.setSearchResults(results);
      this.searchedAlbums = [...results]; // Copie locală
      
      // Setează titlul pentru afișare
      this.search.setTitle(trimmedTerm);
      
      // Verifică starea după setare
      console.log('Title set to:', this.search.title());
      console.log('Results in service:', this.search.getSearchResults().length);
      
      // Navighează și scroll
      this.router.navigate(['/home']).then(() => {
        console.log('Navigation complete, scrolling to top');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Verificare finală după navigare
        setTimeout(() => {
          console.log('Final check - Title:', this.search.title());
          console.log('Final check - Results:', this.search.getSearchResults().length);
        }, 100);
      });
      
    } else {
      console.log('=== NO RESULTS FOUND ===');
      this.showNoResultsMessage(inputEl);
    }
    
    // Curăță input-ul în orice caz
    inputEl.value = '';
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
    console.log('Local searchedAlbums:', this.searchedAlbums.length);
    this.search.debugState();
    this.search.getCurrentSearchState();
  }
}