import Image from "next/image";
import {formattedPrice, formatToTimeAgo} from "@/lib/utils";
import db from "@/lib/db";
import {notFound} from "next/navigation";
import getSession from "@/lib/session";
import {PhotoIcon, UserIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

async function getProduct(id: number) {
  // return new Promise(resolve => setTimeout(resolve, 10000));

  const product = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

async function getIsOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return userId === session.id;
  }

  return false;
}

export default async function ProductDetail({params}: {params: {id: string}}) {
  // await getProduct(id);
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  // const {photo, title, price, created_at} = await getProduct(id);
  const product = await getProduct(id);
  console.log(product)

  if (!product) {
    notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  console.log(isOwner)

  return (
    <div className="p-5 pb-32 flex flex-col gap-5">
      <div className="w-full aspect-square 4 rounded-md relative">
        <Image src={product.photo} alt={product.title} fill className="object-cover" />
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full flex justify-center items-center bg-neutral-700 overflow-hidden relative">
          {
            product.user.avatar ?
            <Image src={product.user.avatar} alt={product.user.username} fill className="object-cover" /> :
            <UserIcon className="size-8" />
          }
        </div>
        <div className="flex flex-col gap-2">
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="w-full h-[1px] bg-neutral-700" />
      <div className="">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p>{product.description}</p>
          <p>{formatToTimeAgo(product.created_at)}</p>
        </div>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 bg-neutral-800 flex justify-between items-center">
        <p className="font-semibold text-lg">{formattedPrice(product.price)}원</p>
        <div className={isOwner ? "flex items-center gap-5" : ""}>
          {
            isOwner && <Link href={``} className="bg-red-500 text-white px-5 py-2.5 rounded-md">삭제하기</Link>
          }
          <Link href={``} className="bg-orange-500 text-white px-5 py-2.5 rounded-md">채팅하기</Link>
        </div>
      </div>
    </div>
  );
}