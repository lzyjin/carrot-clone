"use server";

import {z} from "zod";
import {
  PRODUCT_DESCRIPTION__MAX_LENGTH_ERROR, PRODUCT_DESCRIPTION_MAX_LENGTH, PRODUCT_PHOTO_UPLOAD_BASE_URL,
  PRODUCT_TITLE__MAX_LENGTH_ERROR,
  PRODUCT_TITLE_MAX_LENGTH
} from "@/lib/constants";
// import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import {redirect} from "next/navigation";

const formSchema = z.object({
  photo: z
    .string({
      required_error: "사진은 필수입니다.",
    }),
  title: z
    .string()
    .max(PRODUCT_TITLE_MAX_LENGTH, PRODUCT_TITLE__MAX_LENGTH_ERROR),
  price: z
    .coerce
    .number(),
  description: z
    .string()
    .max(PRODUCT_DESCRIPTION_MAX_LENGTH, PRODUCT_DESCRIPTION__MAX_LENGTH_ERROR),
});

export async function uploadProduct(prevState: any, formData: FormData) {
  const photo = formData.get("photo");
  console.log("photo: ---------");
  console.log(photo);

  // 우리 서버에 파일 저장한 방법
  // const file = formData.get("photo");
  // if (!(file instanceof File) || file.size === 0) {
  if (photo === `${PRODUCT_PHOTO_UPLOAD_BASE_URL}/`) {
    return {
      fieldErrors: {
        photo: ["사진은 필수입니다."],
        title: [],
        price: [],
        description: [],
      },
    };
  }

  // 우리 서버에 파일 저장한 방법
  // let photoPath = "";
  // if (file.size > 0) {
  //   const photoData = await file.arrayBuffer();
  //   await fs.appendFile(`./public/${file.name}`, Buffer.from(photoData));
  //   photoPath = `/${file.name}`;
  // }

  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    photo: photo,
    description: formData.get("description"),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          price: result.data.price,
          photo: result.data.photo,
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            }
          }
        },
        select: {
          id: true,
        },
      });

      console.log(product);
      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadURL() {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    }
  });
  const data = await response.json();
  return data;
}