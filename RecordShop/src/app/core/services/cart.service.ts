import { Injectable } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'vinyl' | 'cd';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  constructor() { }

  // Adaugă produs în coș
  addToCart(name: string, price: number, type: 'vinyl' | 'cd'): void {
    const existingItem = this.cartItems.find(item => item.name === name && item.type === type);
    
    if (existingItem) {
      // Dacă produsul există deja, crește cantitatea
      existingItem.quantity++;
    } else {
      // Dacă e produs nou, adaugă-l în coș
      const newItem: CartItem = {
        id: `${type}-${Date.now()}-${Math.random()}`,
        name,
        price,
        quantity: 1,
        type
      };
      this.cartItems.push(newItem);
    }
  }

  // Obține toate produsele din coș
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Calculează prețul total
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calculează numărul total de produse
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Șterge un anumit produs din coș
  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  // Golește coșul complet
  clearCart(): void {
    this.cartItems = [];
  }

  // Verifică dacă coșul este gol
  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  // Updatează cantitatea unui produs
  updateQuantity(itemId: string, newQuantity: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
    } else if (item && newQuantity <= 0) {
      this.removeFromCart(itemId);
    }
  }
}