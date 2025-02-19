import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
import { CartService } from '../services/cart.service';

interface CartItem {
  id?: number; // Optional since new items won't have an ID yet
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
  imports: [CommonModule, HttpClientModule, FormsModule], // ✅ Add FormsModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass'],
  providers: [CartService]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  // Track new item row
  newItem: CartItem | null = null;
  addingItem: boolean = false; // ✅ Track loading state for new item submission

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }
  
  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }
  createCart(): void {
    this.cartService.createCart().subscribe({
      next: (newCart) => {
        console.log('Cart created successfully:', newCart);
        this.cart = newCart;
        this.errorMessage = null; // ✅ Remove error message if creation is successful
      },
      error: (error) => {
        console.error('Failed to create cart:', error);
        this.errorMessage = error.message;
      }
    });
  }

  get formattedSubtotal(): string {
    return this.cart ? this.cart.subtotal.toFixed(2) : '0.00';
  }

  get formattedTaxes(): string {
    return this.cart ? this.cart.taxes.toFixed(2) : '0.00';
  }

  get formattedFinalTotal(): string {
    return this.cart ? this.cart.final_total.toFixed(2) : '0.00';
  }

  // ✅ Show a new empty row for adding an item
  addNewItemRow(): void {
    if (!this.cart) return;

    this.newItem = {
      cart_id: this.cart.id,
      product_name: '',
      price: 0,
      quantity: 1
    };
  }

  // ✅ Submit the new item to FastAPI
  submitNewItem(): void {
    if (!this.cart || !this.newItem || this.addingItem) return;

    this.addingItem = true; // ✅ Prevent duplicate submissions

    this.cartService.addCartItem(
      this.newItem.product_name,
      this.newItem.price,
      this.newItem.quantity
    ).subscribe({
      next: (createdItem) => {
        this.cart?.items.push(createdItem); // ✅ Add new item to cart list
        this.newItem = null; // ✅ Reset the input row
        this.addingItem = false;
        window.location.reload()
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.addingItem = false;
      }
    });
  }

  // ✅ Cancel new item input row
  cancelNewItem(): void {
    this.newItem = null;
  }

  removeItem(itemId: number | undefined): void {
    if (!this.cart || itemId === undefined) {
      console.error('Remove Item Failed: itemId is undefined or cart is null');
      return;
    }
  
    console.log(`Removing item with ID: ${itemId}`);
  
    this.cartService.deleteCartItem(itemId).subscribe({
      next: () => {
        console.log(`Item ${itemId} removed successfully from backend`);
        this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
        window.location.reload(); // ✅ Force reload after deletion
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = error.message;
      }
    });
  }
  
  
}
