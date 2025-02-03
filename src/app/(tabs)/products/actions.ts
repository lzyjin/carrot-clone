"use server";

import db from "@/lib/db";
import {PRODUCT_LIST_COUNT} from "@/lib/constants";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      description: true,
      created_at: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: PRODUCT_LIST_COUNT,
    skip: page * PRODUCT_LIST_COUNT,
  });

  return products;
}