import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { VinylListComponent } from "../vinyl-list/vinyl-list.component";
import { CdListComponent } from "../cd-list/cd-list.component";
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, VinylListComponent, CdListComponent, FooterComponent, NavbarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
