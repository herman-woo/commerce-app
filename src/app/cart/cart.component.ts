import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Define interfaces for strong typing
interface CartItem {
  id: number;
  cart_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

interface Cart {
  id: number;
  subtotal: number;
  taxes: number;
  final_total: number;
  items: CartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {
  cart!: Cart;

  constructor() {}

  ngOnInit(): void {
    // Simulated API call
    this.fetchCartData();
  }

  fetchCartData(): void {
    // Simulating a backend response with static data
    this.cart = {
      id: 1,
      subtotal: 63.96,
      taxes: 4.4772,
      final_total: 68.4372,
      items: [
        {
          id: 1,
          cart_id: 1,
          product_name: 'Stocks',
          price: 15.99,
          quantity: 2
        },
        {
          id: 2,
          cart_id: 1,
          product_name: 'Screws',
          price: 15.99,
          quantity: 2
        }
      ]
    };
  }
  get formattedSubtotal(): string {
    return this.cart?.subtotal?.toFixed(2) ?? '0.00';
  }
  
  get formattedTaxes(): string {
    return this.cart?.taxes?.toFixed(2) ?? '0.00';
  }
  
  get formattedFinalTotal(): string {
    return this.cart?.final_total?.toFixed(2) ?? '0.00';
  }
  addItem(): void {
    const newItem = {
      id: this.cart.items.length + 1,
      cart_id: this.cart.id,
      product_name: 'New Item',
      price: 12.99,
      quantity: 1
    };
    this.cart.items.push(newItem);
  }
  
}