import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdContainer } from '../../core/interfaces/cd.interface';

@Component({
  selector: 'app-cd',
  standalone: true,
  imports: [],
  templateUrl: './cd.component.html',
  styleUrl: './cd.component.scss'
})
export class CdComponent implements OnInit {
  @Input() cdCard!: CdContainer
  @Output() selectedCdName = new EventEmitter<string>();

  cdImage: string = '';
  cdText: string = '';
  cdPrice: number = 0;

  ngOnInit() {
    this.cdImage = this.cdCard.image;
    this.cdText = this.cdCard.text;
    this.cdPrice = this.cdCard.price;
  }

  onOrderNow() {
    this.selectedCdName.emit(this.cdText);
  }
}
