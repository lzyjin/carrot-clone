"use server";

import {z} from "zod";
import validator from "validator";
import {SMS_TOKEN_MAX, SMS_TOKEN_MIN} from "@/lib/constants";
import {redirect} from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "잘못된 형식입니다.");

const tokenSchema = z
  .coerce
  .number()
  .min(SMS_TOKEN_MIN)
  .max(SMS_TOKEN_MAX);

interface ActionState {
  token: boolean;
}

// prevState는 처음에는 useFormState의 두번째 인자로 전달한 초기값,
// form을 submit한 뒤부터는, 즉 form action인 서버액션 smsLogin이 무언가를 반환한 뒤부터는 prevState는 그 반환값임.
export const smsLogin = async (prevState: ActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token"); // number타입의 input이지만 string타입으로 넘어옴

  if (prevState.token) {
    // 인증번호 입력 후
    const result = tokenSchema.safeParse(token);

    if (result.success) {
      // 로그인 처리
      redirect("/");
    } else {
      console.log(result.error.flatten());
      // 인증번호는 그대로 보여야 하므로 token: true, 검증에 실패했기 때문에 에러메시지도 함꼐 전달
      return {
        token: true,
        error: result.error.flatten(),
      };
    }
  } else {
    // 인증전(인증번호 없음, 전화번호만 입력함)
    const result = phoneSchema.safeParse(phone);

    if (result.success) {
      return {
        // 인증번호는 그대로 보여야 하므로 token: true
        token: true,
      };
    } else {
      // console.log(result.error.flatten());
      return {
        token: false,
        error: result.error.flatten(),
      };
    }
  }
};