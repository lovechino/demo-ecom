import publicApi from "@/lib/publicApi";
import { ProductModel } from "@/models/product.model";
import { ProductType } from "@/types/products.types";

export class ProductService {
    async getProduct() : Promise<ProductModel[]>{
        const res: ProductType[] = await publicApi.post("/product/GetAllProduct").then((data) => data.data).catch((err) => {throw new Error(err)})
        return res.map((item) => new ProductModel(item.id, item.name, item.description, item.price, item.stock, item.image_url, item.category, item.category_id))
    }
    async getProductById(id: string) : Promise<ProductModel[]>{
        const res: ProductType[] = await publicApi.post("/product/GetProductByCategoryId", {id}).then((data) => data.data).catch((err) => {throw new Error(err)})
        return res.map((item) => new ProductModel(item.id, item.name, item.description, item.price, item.stock, item.image_url, item.category, item.category_id))
    }
}