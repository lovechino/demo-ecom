"use client";
import { CategoryViewModel } from "@/viewmodels/CategoryModel";
import Image from "next/image";

export default function Home() {
  const category = new CategoryViewModel()
  const test = async()=>{
    await category.getCategory()
    const test = category.category
    
    console.log(category.category)
  }
  
  return (
  <div onClick={()=>test()}>r</div>
  );
}
