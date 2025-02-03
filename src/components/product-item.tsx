import Link from "next/link";
import Image from "next/image";
import {formattedPrice, formatToTimeAgo} from "@/lib/utils";

interface ListProductProps {
  title: string;
  photo: string;
  price: number;
  description: string;
  created_at: Date;
  id: number;
}

export default function ProductItem({
  title,
  photo,
  price,
  description,
  created_at,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image src={photo} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 text-white">
        <div>{title}</div>
        <div>{formatToTimeAgo(created_at)}</div>
        <div className="font-semibold">{formattedPrice(price)}원</div>
      </div>
    </Link>
  );
}