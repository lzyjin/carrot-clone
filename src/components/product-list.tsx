"use client";

import ProductItem from "@/components/product-item";
import {InitialProducts} from "@/app/(tabs)/products/page";
import {useEffect, useRef, useState} from "react";
import {getMoreProducts} from "@/app/(tabs)/products/actions";
import {PRODUCT_LIST_COUNT} from "@/lib/constants";

interface ProductListProps {
  // initialProducts: {
  //   id: number;
  //   title: string;
  //   price: number;
  //   description: string;
  //   photo: string;
  //   created_at: Date;
  // }[];

  // 혹은
  initialProducts: InitialProducts;
}

export default function ProductList({initialProducts}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const loadTrigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const element = entries[0];
        if (element.intersectionRatio <= 0) return;

        if (element.isIntersecting && loadTrigger.current) {
          intersectionObserver.unobserve(loadTrigger.current);

          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);

          if(newProducts.length !== 0) {
            setPage(prev => prev + 1);
          } else {
            setIsLastPage(true);
          }

          setProducts(prev => [...prev, ...newProducts])
          setIsLoading(false);
        }
    }, {
        threshold: 1.0,
      });

    if (loadTrigger.current !== null) {
      intersectionObserver.observe(loadTrigger.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [page]);

  return (
    <div className="flex flex-col gap-5 p-5">
      {
        products.map(product => (
          <ProductItem key={product.id} {...product} />
        ))
      }

      {
        isLastPage ?
        null :
        <span
          ref={loadTrigger}
          className="opacity-0 bg-orange-500 text-white w-32 mx-auto px-5 py-2.5 rounded-md">
            {isLoading ? "로딩중" : "상품 더보기"}
        </span>
      }

    </div>
  );
}