"use server";

import {z} from "zod";
import {
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_MIN_LENGTH_ERROR, USERNAME_MAX_LENGTH_ERROR, REQUIRED_ERROR
} from "@/lib/constants";

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = (
  {password, confirm_password}: {password: string, confirm_password: string}
) => password === confirm_password;

const schema = z
  .object({
    username: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .trim()
      .toLowerCase()
      .max(USERNAME_MAX_LENGTH, {
        message: USERNAME_MAX_LENGTH_ERROR
      })
      // .refine(checkUsername, { // 조건이 false이면 에러 메시지 표시
      //   message: "potato는 포함할 수 없습니다."
      // })
    ,
    email: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .email()
      .trim()
      .toLowerCase(),
    password: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .trim()
      .min(PASSWORD_MIN_LENGTH, {
        message: PASSWORD_MIN_LENGTH_ERROR
      })
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .trim()
      .min(PASSWORD_MIN_LENGTH, {
        message: PASSWORD_MIN_LENGTH_ERROR
      })
  })
  .refine(checkPassword, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["confirm_password"]
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"), // get()에 들어가는 텍스트는 input의 name값
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirmPassword"),
  };

  const result = schema.safeParse(data);

  if (result.success) {
    console.log(result.data);
    // 검증이 끝난 result.data를 사용해야 한다.
    // 사용자가 입력한 값일 뿐인 data는 사용하면 절대 절대 절대 안된다!!!!!!!!
  } else {
    // console.log(result.error.flatten());
    return result.error.flatten();
  }
};