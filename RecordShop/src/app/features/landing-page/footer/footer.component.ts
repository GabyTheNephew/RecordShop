import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private router: Router) {} 

  goToShop() {
    this.router.navigate(['/shop']);
  }
}