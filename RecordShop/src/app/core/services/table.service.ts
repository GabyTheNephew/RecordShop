import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Table } from '../interfaces/table.interface';

@Injectable({ 
  providedIn: 'root' 
})
export class TableService {
  
  private generateInitialTables(): Table[] {
    const cdTables = [
      { id: 1, controlNumber: 'CD001', albumName: 'Because The Internet', price: 149.99, productType: 'CD' as const, stockQuantity: 25, soldQuantity: 12, image: '/album_covers/BecauseTheInternet.jpg' },
      { id: 2, controlNumber: 'CD002', albumName: 'SOS', price: 149.99, productType: 'CD' as const, stockQuantity: 30, soldQuantity: 8, image: '/album_covers/SOS.png' },
      { id: 3, controlNumber: 'CD003', albumName: 'Channel Orange', price: 149.99, productType: 'CD' as const, stockQuantity: 20, soldQuantity: 15, image: '/album_covers/ChannelOrange.jpg' },
      { id: 4, controlNumber: 'CD004', albumName: 'Red moon In Venus', price: 149.99, productType: 'CD' as const, stockQuantity: 18, soldQuantity: 7, image: '/album_covers/RedMoonInVenus.jpg' },
      { id: 5, controlNumber: 'CD005', albumName: 'ALLA', price: 149.99, productType: 'CD' as const, stockQuantity: 22, soldQuantity: 10, image: '/album_covers/ALLA.png' },
      { id: 6, controlNumber: 'CD006', albumName: 'Blonde', price: 149.99, productType: 'CD' as const, stockQuantity: 15, soldQuantity: 20, image: '/album_covers/Blonde.jpg' },
      { id: 7, controlNumber: 'CD007', albumName: 'FlowerBoy', price: 149.99, productType: 'CD' as const, stockQuantity: 28, soldQuantity: 5, image: '/album_covers/FlowerBoy.png' },
      { id: 8, controlNumber: 'CD008', albumName: 'Jackboys', price: 149.99, productType: 'CD' as const, stockQuantity: 12, soldQuantity: 18, image: '/album_covers/Jackboys.jpg' }
    ];

    const vinylTables = [
      { id: 9, controlNumber: 'VNL001', albumName: 'After Hours', price: 199.99, productType: 'Vinyl' as const, stockQuantity: 35, soldQuantity: 14, image: 'album_covers/AfterHours.jpg' },
      { id: 10, controlNumber: 'VNL002', albumName: 'Beauty Behind The Madness', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 40, soldQuantity: 22, image: 'album_covers/BeautyBehindTheMadness.jpg' },
      { id: 11, controlNumber: 'VNL003', albumName: 'DawnFM', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 25, soldQuantity: 11, image: 'album_covers/DawnFM.jpg' },
      { id: 12, controlNumber: 'VNL004', albumName: 'Echoes Of Silence', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 30, soldQuantity: 16, image: 'album_covers/EchoesOfSilence.jpg' },
      { id: 13, controlNumber: 'VNL005', albumName: 'Starboy', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 45, soldQuantity: 28, image: 'album_covers/Starboy.jpg' },
      { id: 14, controlNumber: 'VNL006', albumName: 'Thursday', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 20, soldQuantity: 9, image: 'album_covers/Thursday.jpg' },
      { id: 15, controlNumber: 'VNL007', albumName: 'Abbey Road', price: 200.99, productType: 'Vinyl' as const, stockQuantity: 18, soldQuantity: 32, image: 'album_covers/AbbeyRoad.jpg' },
      { id: 16, controlNumber: 'VNL008', albumName: 'Arcane', price: 149.99, productType: 'Vinyl' as const, stockQuantity: 22, soldQuantity: 13, image: 'album_covers/arcane.jpg' }
    ];

    return [...cdTables, ...vinylTables];
  }

  getAll(): Observable<Table[]> {
    const savedTables = localStorage.getItem('tables');
    if (savedTables) {
      return of(JSON.parse(savedTables));
    } else {
      const initialTables = this.generateInitialTables();
      localStorage.setItem('tables', JSON.stringify(initialTables));
      return of(initialTables);
    }
  }

  saveTables(tables: Table[]): void {
    localStorage.setItem('tables', JSON.stringify(tables));
  }

  resetToInitial(): Observable<Table[]> {
    localStorage.removeItem('tables');
    const initialTables = this.generateInitialTables();
    localStorage.setItem('tables', JSON.stringify(initialTables));
    return of(initialTables);
  }
}