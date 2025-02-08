import db from "@/lib/db";
import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";
import {PRODUCT_LIST_COUNT} from "@/lib/constants";
import Link from "next/link";
import {PlusIcon} from "@heroicons/react/24/solid";

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
      <Link
        href="/products/add"
        className="size-16 rounded-full bg-orange-500 text-white fixed right-5 bottom-24 flex justify-center items-center
          transition-colors hover:bg-orange-400">
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}