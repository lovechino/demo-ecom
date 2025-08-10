import { Category } from "@/models/categories.model";
import { CategoryServices } from "@/services/categories.services";

export class CategoryViewModel{
    private categoryServices : CategoryServices;
    public loading = false
    error : string | null = null
    category : Category[] | null = null
    constructor(){
        this.categoryServices = new CategoryServices()
    }
    async getCategory(){
        this.loading = true
        this.error = null
        try{
            this.category = await this.categoryServices.getCategory()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(err : any){
            this.error = err
        }finally{
            this.loading =false
        }
    }
}