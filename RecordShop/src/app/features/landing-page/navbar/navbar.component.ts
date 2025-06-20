import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT, CommonModule } from '@angular/common';
/* import { AuthService }   from '../../services/auth.service';
import { CartService }   from '../../services/cart.service'; */
import { MusicShopService} from '../../../core/services/music-shop.service';
import { VinylContainer } from '../../../core/interfaces/vinyl.interface';

@Component({
  selector   : 'app-navbar',
  standalone : true,
  imports    : [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.scss']
})
export class NavbarComponent {
  searchedAlbums: VinylContainer[] = [];

  constructor(
    private router : Router,
    // public  auth   : AuthService,
    // public  cart   : CartService,
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
    }, 100); // Mic delay pentru a se asigura că pagina s-a încărcat
  }

  goToAll() {
    // Navighează la pagina home și afișează toate produsele
    this.router.navigate(['/home']).then(() => {
      // Curăță rezultatele căutării pentru a afișa conținutul normal
      this.search.clearSearch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onSearch(term: string, inputEl: HTMLInputElement) {
    // Verifică dacă termenul este gol
    if (!term || term.trim() === '') {
      inputEl.value = '';
      this.searchedAlbums = []; // Curăță rezultatele
      this.search.clearSearch(); // Curăță și în serviciu
      return;
    }

    // Caută rezultate
    const results = this.search.searchAlbumByTitle(term.trim());
    
    if (results.length > 0) {
      // S-au găsit rezultate - setează rezultatele și titlul
      this.searchedAlbums = results;
      this.search.setTitle(term.trim());
      
      // Navighează la home page
      this.router.navigate(['/home']).then(() => {
        // Scroll la începutul paginii pentru a vedea rezultatele
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Curăță input-ul
      inputEl.value = '';
      
    } else {
      // Nu s-au găsit rezultate - afișează "NO RESULTS"
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