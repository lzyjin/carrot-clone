"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import {PhotoIcon} from "@heroicons/react/24/solid";
import React, {useState} from "react";
import Image from "next/image";
import {getUploadURL, uploadProduct} from "@/app/products/add/actions";
import {useFormState} from "react-dom";
import {PRODUCT_PHOTO_UPLOAD_BASE_URL} from "@/lib/constants";

export default function AddProduct() {
  const [imagePreview, setImagePreview] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const [imageId, setImageId] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {target: {files}} = e;

    if (files === null) {
      return;
    }

    setImagePreview(URL.createObjectURL(files[0]));
    const {success, result} = await getUploadURL();

    if (success) {
      const {id, uploadURL} = result;
      setUploadURL(uploadURL);
      setImageId(id);
    }
  };

  // form action을 낚아채서 파일을 업로드하고 그 이미지 url로 검증함
  const interceptAction = async (prevState: any, formData: FormData) => {
    // cloudflare에 이미지 업로드
    const file = formData.get("photo");

    if (!file) {
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadURL, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const photoUrl = `${PRODUCT_PHOTO_UPLOAD_BASE_URL}/${imageId}`;

    // formData의 photo 변경(file -> string)
    formData.set("photo", photoUrl);

    // upload product 호출
    return uploadProduct(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div className="p-5">
      <form action={action} className="flex flex-col gap-3">
        <label
          className={`cursor-pointer aspect-square text-neutral-300 border-2 border-neutral-300 rounded-md
          flex flex-col justify-center items-center gap-2 relative overflow-hidden ${imagePreview === "" ? "border-dashed" : ""}`}>
          <input
            type="file"
            name="photo"
            id="photo"
            accept=".jpg, .jpeg, .png"
            size={3 * 1024 * 1024}
            className="opacity-100 absolute left-0 top-0 pointer-events-none outline-none focus:outline-none active:outline-none"
            onChange={onImageChange}
          />
          {
            imagePreview === "" ?
              <>
                <PhotoIcon className="size-12"/>
                <span>사진을 추가해주세요.</span>
                <span className="text-red-500">{state?.fieldErrors.photo}</span>
              </> :
              <Image src={imagePreview} alt="이미지 미리보기" fill className="object-cover"/>
          }
        </label>
        <Input
          type="text"
          name="title"
          placeholder="제목"
          required={true}
          errors={state?.fieldErrors.title}
        />
        <Input
          type="number"
          name="price"
          placeholder="가격"
          required={true}
          errors={state?.fieldErrors.price}
        />
        <Input
          type="text"
          name="description"
          placeholder="설명"
          required={true}
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료"/>
      </form>
    </div>
  );
}