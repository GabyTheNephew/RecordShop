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

  addToCart(name: string, price: number, type: 'vinyl' | 'cd'): void {
    const existingItem = this.cartItems.find(item => item.name === name && item.type === type);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
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

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
    } else if (item && newQuantity <= 0) {
      this.removeFromCart(itemId);
    }
  }
}