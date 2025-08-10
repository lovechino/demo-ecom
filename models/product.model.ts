export class ProductModel {
    private id : string
    private name : string
    private description : string 
    private price : number
    private stock : number
    private image_url : string 
    private category : string 
    private category_id : string 
    
    constructor(id:string,name:string,description:string,price:number,stock:number,image_url:string,category:string,category_id:string){
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.stock = stock
        this.image_url = image_url
        this.category = category
        this.category_id = category_id
    }

    //getter and setter
    public getId(): string {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string {
        return this.description;
    }
    public getPrice(): number {
        return this.price;
    }
    public getStock(): number {
        return this.stock;
    }
    public getImageUrl(): string {
        return this.image_url;
    }
    public getCategory(): string {
        return this.category;
    }
    public getCategoryId(): string {
        return this.category_id;
    }
    public setId(id: string): void {
        this.id = id;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public setDescription(description: string): void {
        this.description = description;
    }
    public setPrice(price: number): void {
        this.price = price;
    }
    public setStock(stock: number): void {
        this.stock = stock;
    }
    public setImageUrl(imageUrl: string): void {
        this.image_url = imageUrl;
    }
    public setCategory(category: string): void {
        this.category = category;
    }
    public setCategoryId(categoryId: string): void {
        this.category_id = categoryId;
    }
    public toJson(): string {
        return JSON.stringify(this);
    }
}