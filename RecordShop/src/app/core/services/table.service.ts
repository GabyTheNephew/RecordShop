import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Table } from '../interfaces/table.interface';

@Injectable({ 
  providedIn: 'root' 
})
export class TableService {
  
  private generateInitialTables(): Table[] {
    const cdTables = [
      { id: 1, controlNumber: 'CD001', albumName: 'Because The Internet', price: 89.99, productType: 'CD' as const, stockQuantity: 25, soldQuantity: 12, image: '/album_covers/BecauseTheInternet.jpg' },
      { id: 2, controlNumber: 'CD002', albumName: 'SOS', price: 124.50, productType: 'CD' as const, stockQuantity: 30, soldQuantity: 8, image: '/album_covers/SOS.png' },
      { id: 3, controlNumber: 'CD003', albumName: 'Channel Orange', price: 67.99, productType: 'CD' as const, stockQuantity: 20, soldQuantity: 15, image: '/album_covers/ChannelOrange.jpg' },
      { id: 4, controlNumber: 'CD004', albumName: 'Red moon In Venus', price: 156.99, productType: 'CD' as const, stockQuantity: 18, soldQuantity: 7, image: '/album_covers/RedMoonInVenus.jpg' },
      { id: 5, controlNumber: 'CD005', albumName: 'ALLA', price: 78.50, productType: 'CD' as const, stockQuantity: 22, soldQuantity: 10, image: '/album_covers/ALLA.png' },
      { id: 6, controlNumber: 'CD006', albumName: 'DawnFM', price: 102.99, productType: 'CD' as const, stockQuantity: 28, soldQuantity: 5, image: 'album_covers/DawnFM.jpg' },
      { id: 7, controlNumber: 'CD007', albumName: 'Blonde', price: 189.99, productType: 'CD' as const, stockQuantity: 15, soldQuantity: 20, image: '/album_covers/Blonde.jpg' },
      { id: 8, controlNumber: 'CD008', albumName: 'FlowerBoy', price: 95.50, productType: 'CD' as const, stockQuantity: 28, soldQuantity: 5, image: '/album_covers/FlowerBoy.png' },
      { id: 9, controlNumber: 'CD009', albumName: 'Jackboys', price: 134.99, productType: 'CD' as const, stockQuantity: 12, soldQuantity: 18, image: '/album_covers/Jackboys.jpg' },
      { id: 10, controlNumber: 'CD010', albumName: 'Life Of a Don', price: 73.99, productType: 'CD' as const, stockQuantity: 35, soldQuantity: 6, image: '/album_covers/LifeOfADon.jpg' },
      { id: 11, controlNumber: 'CD011', albumName: '1989', price: 167.50, productType: 'CD' as const, stockQuantity: 40, soldQuantity: 25, image: '/album_covers/1989.jpg' },
      { id: 12, controlNumber: 'CD012', albumName: 'Demon Days', price: 145.99, productType: 'CD' as const, stockQuantity: 18, soldQuantity: 14, image: '/album_covers/DemonDays.jpg' },
      { id: 13, controlNumber: 'CD013', albumName: 'The Velvet Underground', price: 198.99, productType: 'CD' as const, stockQuantity: 12, soldQuantity: 8, image: '/album_covers/TheVelvetUnderground.jpg' },
      { id: 14, controlNumber: 'CD014', albumName: 'AM', price: 85.50, productType: 'CD' as const, stockQuantity: 32, soldQuantity: 19, image: '/album_covers/AM.jpg' },
      { id: 15, controlNumber: 'CD015', albumName: 'A Night At The Opera', price: 176.99, productType: 'CD' as const, stockQuantity: 15, soldQuantity: 12, image: '/album_covers/ANightAtOpera.jpg' },
      { id: 16, controlNumber: 'CD016', albumName: 'She\'s So Unusual', price: 112.50, productType: 'CD' as const, stockQuantity: 25, soldQuantity: 9, image: '/album_covers/She\'sSoUnusual.jpg' },
      { id: 17, controlNumber: 'CD017', albumName: 'My Beautiful Dark Twisted Fantasy', price: 159.99, productType: 'CD' as const, stockQuantity: 20, soldQuantity: 16, image: '/album_covers/MyBeautifulDarkTwistedFantasy.jpg' }
    ];

    const vinylTables = [
      { id: 18, controlNumber: 'VNL001', albumName: 'After Hours', price: 187.50, productType: 'Vinyl' as const, stockQuantity: 35, soldQuantity: 14, image: 'album_covers/AfterHours.jpg' },
      { id: 19, controlNumber: 'VNL002', albumName: 'Beauty Behind The Madness', price: 134.99, productType: 'Vinyl' as const, stockQuantity: 40, soldQuantity: 22, image: 'album_covers/BeautyBehindTheMadness.jpg' },
      { id: 20, controlNumber: 'VNL003', albumName: 'DawnFM', price: 168.50, productType: 'Vinyl' as const, stockQuantity: 25, soldQuantity: 11, image: 'album_covers/DawnFM.jpg' },
      { id: 21, controlNumber: 'VNL004', albumName: 'Echoes Of Silence', price: 245.99, productType: 'Vinyl' as const, stockQuantity: 30, soldQuantity: 16, image: 'album_covers/EchoesOfSilence.jpg' },
      { id: 22, controlNumber: 'VNL005', albumName: 'Starboy', price: 156.99, productType: 'Vinyl' as const, stockQuantity: 45, soldQuantity: 28, image: 'album_covers/Starboy.jpg' },
      { id: 23, controlNumber: 'VNL006', albumName: 'SOS', price: 142.50, productType: 'Vinyl' as const, stockQuantity: 28, soldQuantity: 13, image: '/album_covers/SOS.png' },
      { id: 24, controlNumber: 'VNL007', albumName: 'Thursday', price: 189.99, productType: 'Vinyl' as const, stockQuantity: 20, soldQuantity: 9, image: 'album_covers/Thursday.jpg' },
      { id: 25, controlNumber: 'VNL008', albumName: 'Abby Road', price: 298.50, productType: 'Vinyl' as const, stockQuantity: 18, soldQuantity: 32, image: 'album_covers/AbbeyRoad.jpg' },
      { id: 26, controlNumber: 'VNL009', albumName: 'Arcane', price: 179.99, productType: 'Vinyl' as const, stockQuantity: 22, soldQuantity: 13, image: 'album_covers/arcane.jpg' },
      { id: 27, controlNumber: 'VNL010', albumName: 'Purple Rain', price: 267.50, productType: 'Vinyl' as const, stockQuantity: 16, soldQuantity: 21, image: 'album_covers/PurpleRain.jpg' },
      { id: 28, controlNumber: 'VNL011', albumName: 'Rumours', price: 234.99, productType: 'Vinyl' as const, stockQuantity: 24, soldQuantity: 18, image: 'album_covers/Rumours.jpg' },
      { id: 29, controlNumber: 'VNL012', albumName: 'Born In The USA', price: 176.50, productType: 'Vinyl' as const, stockQuantity: 30, soldQuantity: 15, image: 'album_covers/BornInTheUSA.jpg' },
      { id: 30, controlNumber: 'VNL013', albumName: 'Favourite Worst Nightmare', price: 145.99, productType: 'Vinyl' as const, stockQuantity: 26, soldQuantity: 11, image: 'album_covers/FavouriteWorstNightmare.jpg' },
      { id: 31, controlNumber: 'VNL014', albumName: 'Nevermind', price: 289.99, productType: 'Vinyl' as const, stockQuantity: 14, soldQuantity: 27, image: 'album_covers/Nevermind.jpg' },
      { id: 32, controlNumber: 'VNL015', albumName: 'The Dark Side Of The Moon', price: 312.50, productType: 'Vinyl' as const, stockQuantity: 12, soldQuantity: 23, image: 'album_covers/TheDarkSideOfTheMoon.jpg' },
      { id: 33, controlNumber: 'VNL016', albumName: 'Bohemian Rhapsody', price: 203.99, productType: 'Vinyl' as const, stockQuantity: 19, soldQuantity: 16, image: 'album_covers/BohemianRhapsody.jpg' },
      { id: 34, controlNumber: 'VNL017', albumName: 'Acoustica', price: 124.50, productType: 'Vinyl' as const, stockQuantity: 33, soldQuantity: 8, image: 'album_covers/Acoustica.jpg' }
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