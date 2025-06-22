import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <- Asigură-te că e importat
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private router: Router) {} // <- Adaugă aceasta

  goToShop() {
    this.router.navigate(['/shop']);
  }
}