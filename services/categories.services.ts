import publicApi from "@/lib/publicApi";
import { Category } from "@/models/categories.model";
import { CategoryType } from "@/types/categories.types";



export class CategoryServices {
    async getCategory() : Promise<Category[]>{
        const res: CategoryType[] = await publicApi
      .get("/categories")
      .then((data) => data.data)
      .catch((err) => {
        throw new Error(err);
      });

    return res.map(
      (item) =>
        new Category(item.id, item.name, item.description, item.created_at)
    );
    }
}