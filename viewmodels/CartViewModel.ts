import { CartModel } from "@/models/cart.model";
import { CartServices } from "@/services/cart.services";

export class CartViewModel {
    private cartServices: CartServices;
    public loading = false;
    error: string | null = null;
    cart: CartModel[] | null = null;

    constructor() {
        this.cartServices = new CartServices();
    }

    async getCart() {
        this.loading = true;
        this.error = null;
        try {
            this.cart = await this.cartServices.getCart();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.error = err;
        } finally {
            this.loading = false;
        }
    }

    async insertCart(product_id: string, quantity: number) {
        this.loading = true;
        this.error = null;
        try {
            const newCartItem = await this.cartServices.insertCart(product_id, quantity);
            // Refresh cart after inserting new item
            await this.getCart();
            return newCartItem;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.error = err;
            throw err;
        } finally {
            this.loading = false;
        }
    }

    async updateCart(cart_id: string, quantity: number) {
        this.loading = true;
        this.error = null;
        try {
            const updatedCartItem = await this.cartServices.updateCart(cart_id, quantity);
            // Refresh cart after updating
            await this.getCart();
            return updatedCartItem;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.error = err;
            throw err;
        } finally {
            this.loading = false;
        }
    }

    async deleteCart(cart_id: string) {
        this.loading = true;
        this.error = null;
        try {
            await this.cartServices.deleteCart(cart_id);
            // Refresh cart after deleting
            await this.getCart();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.error = err;
            throw err;
        } finally {
            this.loading = false;
        }
    }
}
