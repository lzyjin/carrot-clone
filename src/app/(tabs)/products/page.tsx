import db from "@/lib/db";
import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";
import {PRODUCT_LIST_COUNT} from "@/lib/constants";

async function getInitialProducts() {
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
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}