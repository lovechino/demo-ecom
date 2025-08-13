"use client";
import { useEffect, useState, useCallback } from "react";
import { ProductViewModel } from "@/viewmodels/ProductViewModel";
import { ProductModel } from "@/models/product.model";
import Image from "next/image";

// Simple SVG icons without external dependency
const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Demo data fallback to ensure banner always shows
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "MacBook Pro M2",
    description: "Laptop mạnh mẽ với chip M2, hiệu suất vượt trội cho công việc và sáng tạo",
    price: 45000000,
    image_url: "https://res.cloudinary.com/dwmvbewoy/image/upload/v1749024435/ecom-demo/MacBookProM2.webp",
    category: "Laptop",
    category_id: "laptop"
  },
  {
    id: "demo-2", 
    name: "iPhone 15 Pro",
    description: "Smartphone cao cấp với camera chuyên nghiệp và hiệu suất mạnh mẽ",
    price: 28000000,
    image_url: "https://res.cloudinary.com/dwmvbewoy/image/upload/v1749024435/ecom-demo/GooglePixel8.webp",
    category: "Điện thoại",
    category_id: "phone"
  },
  {
    id: "demo-3",
    name: "Tai nghe Sony WH-1000XM5",
    description: "Tai nghe chống ồn hàng đầu với chất âm tuyệt vời và thời lượng pin dài",
    price: 8500000,
    image_url: "https://res.cloudinary.com/dwmvbewoy/image/upload/v1749024435/ecom-demo/TaingheSonyWH-1000XM5.webp",
    category: "Phụ kiện",
    category_id: "accessories"
  }
];

export default function BannerSlide() {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<ProductModel[]>([]);

  // Initialize with demo data immediately
  useEffect(() => {
    const initBanner = async () => {
      try {
        // Start with demo data for immediate display
        const demoProducts = DEMO_PRODUCTS.map(item => 
          new ProductModel(
            item.id, 
            item.name, 
            item.description, 
            item.price, 
            100, // stock
            item.image_url, 
            item.category, 
            item.category_id
          )
        );
        setFeaturedProducts(demoProducts);
        setLoading(false);
        
        // Try to load from API in background
        const vm = new ProductViewModel();
        await vm.getProducts();
        
        if (vm.products && vm.products.length > 0) {
          const apiProducts = vm.products.slice(0, 5);
          setFeaturedProducts(apiProducts);
          console.log('BannerSlide: Updated with', apiProducts.length, 'products from API');
        }
      } catch (err) {
        console.log('BannerSlide: Using demo data (API failed)');
      }
    };

    initBanner();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const nextSlide = useCallback(() => {
    if (featuredProducts.length <= 1) return;
    setCurrentSlide((prev) => 
      prev === featuredProducts.length - 1 ? 0 : prev + 1
    );
  }, [featuredProducts.length]);

  const prevSlide = useCallback(() => {
    if (featuredProducts.length <= 1) return;
    setCurrentSlide((prev) => 
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  }, [featuredProducts.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Show loading state briefly
  if (loading) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500 text-lg">Đang tải banner...</div>
      </div>
    );
  }

  // This should never happen with demo data, but just in case
  if (featuredProducts.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-blue-600">
          <div className="text-xl font-semibold mb-2">Chào mừng đến với Demo E-commerce</div>
          <div className="text-sm">Khám phá sản phẩm chất lượng cao</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-100 border-b">
      {/* Banner Slides */}
      <div className="relative w-full h-full">
        {featuredProducts.map((product, index) => (
          <div
            key={product.getId()}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              {/* Background Image with fallback */}
              <div className="absolute inset-0">
                <Image
                  src={product.getImageUrl()}
                  alt={product.getName()}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  onError={(e) => {
                    // Fallback to background image if Next.js Image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.backgroundImage = `url(${product.getImageUrl()})`;
                      parent.style.backgroundSize = 'cover';
                      parent.style.backgroundPosition = 'center';
                      parent.style.backgroundRepeat = 'no-repeat';
                    }
                  }}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-6 max-w-2xl">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                    {product.getName()}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 drop-shadow-md line-clamp-2">
                    {product.getDescription()}
                  </p>
                  <div className="text-2xl md:text-3xl font-bold mb-6 drop-shadow-lg">
                    {product.getPrice().toLocaleString('vi-VN')} ₫
                  </div>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg transform hover:scale-105">
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {featuredProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-20 transform hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-20 transform hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {featuredProducts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30">
        <div 
          className="h-full bg-white transition-all duration-500 ease-linear"
          style={{
            width: `${((currentSlide + 1) / featuredProducts.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
