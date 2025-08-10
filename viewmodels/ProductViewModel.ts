import { ProductModel } from "@/models/product.model";
import { ProductService } from "@/services/products.services";

export class ProductViewModel{
    private productServices : ProductService;
    public loading = false
    error : string | null = null
    products : ProductModel[] | null = null
    product : ProductModel | null = null
    
    constructor(){
        this.productServices = new ProductService()
    }
    
    async getProducts(){
        this.loading = true
        this.error = null
        try{
            this.products = await this.productServices.getProduct()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(err : any){
            this.error = err
        }finally{
            this.loading = false
        }
    }
    
    async getProductById(id: string){
        this.loading = true
        this.error = null
        try{
            const products = await this.productServices.getProductById(id)
            this.product = products[0] || null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(err : any){
            this.error = err
        }finally{
            this.loading = false
        }
    }
    
    
}
