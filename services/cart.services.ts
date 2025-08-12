import privateApi from "@/lib/privateApi";
import { CartModel } from "@/models/cart.model";
import { CartType } from "@/types/cart.types";

export class CartServices {
    async getCart(): Promise<CartModel[]> {
        try {
            const res: CartType[] = await privateApi.post("/cart/GetCart");
            
            // Convert CartType[] to CartModel[]
            const cartModels = res.map((cartItem: CartType) => {
                return new CartModel(
                    cartItem.id,
                    cartItem.user_id,
                    cartItem.product_id,
                    cartItem.quantity,
                    new Date(cartItem.created_at)
                );
            });
            
            return cartModels;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw new Error('Failed to fetch cart data');
        }
    }
    async insertCart(product_id: string, quantity: number): Promise<CartModel> {
        try {
            const res: CartType = await privateApi.post("/cart/Insert", {
                product_id: product_id,
                quantity: quantity
            });
            
            // Convert CartType to CartModel
            return new CartModel(
                res.id,
                res.user_id,
                res.product_id,
                res.quantity,
                new Date(res.created_at)
            );
        } catch (error) {
            throw new Error('Error');
        }
    }
    async updateCart(cart_id:string,quantity : number) : Promise<CartModel>{
        try{
            const res : CartType = await privateApi.post("/cart/UpdateQuantity",{
                id : cart_id,
                quantity : quantity
            })
            return new CartModel(
                res.id,
                res.user_id,
                res.product_id,
                res.quantity,
                res.created_at
            )
        }catch(err){
            throw new Error('Error');
        }
    }
    async deleteCart(cart_id:string){
        try{
            const res = await privateApi.delete("/cart/DeleteCart",{
                id : cart_id
            })
        }catch(error){
            throw new Error('Error');
        }
    }
}