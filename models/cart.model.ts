export class CartModel {
    private id: string
    private user_id: string
    private product_id: string
    private quantity: number
    private created_at: Date

    constructor(id: string, user_id: string, product_id: string, quantity: number, created_at: Date) {
        this.id = id
        this.user_id = user_id
        this.product_id = product_id
        this.quantity = quantity
        this.created_at = created_at
    }

    public getId(): string {
        return this.id
    }

    public getUserId(): string {
        return this.user_id
    }

    public getProductId(): string {
        return this.product_id
    }

    public getQuantity(): number {
        return this.quantity
    }

    public getCreatedAt(): Date {
        return this.created_at
    }
}