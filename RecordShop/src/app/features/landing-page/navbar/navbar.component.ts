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
    this.router.navigate(['/home']).then(() => {
      this.search.clearSearch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onSearch(term: string, inputEl: HTMLInputElement) {
    // Verifică dacă termenul este gol
    if (!term || term.trim() === '') {
      inputEl.value = '';
      this.searchedAlbums = [];
      this.search.clearSearch();
      return;
    }

    // Caută în ambele tipuri de produse folosind noua metodă
    const results = this.search.searchAllProducts(term.trim());
    
    if (results.length > 0) {
      // S-au găsit rezultate
      this.searchedAlbums = results;
      this.search.setSearchResults(results);
      
      // Pentru compatibilitate cu componenta home-page, 
      // setăm titlul cu primul rezultat
      this.search.setTitle(term.trim());
      
      // Navighează la home page
      this.router.navigate(['/home']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Curăță input-ul
      inputEl.value = '';
      
    } else {
      // Nu s-au găsit rezultate
      this.searchedAlbums = [];
      inputEl.value = '';
      inputEl.placeholder = 'NO RESULTS';
      inputEl.classList.add('no-result');
      
      setTimeout(() => {
        inputEl.placeholder = 'Search albums, artists...';
        inputEl.classList.remove('no-result');
      }, 2000);
    }
  }
}