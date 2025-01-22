// server action

"use server";

import {z} from "zod";
import {PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, PASSWORD_REGEX, PASSWORD_REGEX_ERROR} from "@/lib/constants";

const schema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(PASSWORD_MIN_LENGTH, {
      message: PASSWORD_MIN_LENGTH_ERROR
    })
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// prevState는 처음에는 useFormState의 두번째 인자로 전달한 초기값,
// handleForm이 무언가를 반환한 뒤부터는 그 반환값
export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = schema.safeParse(data);
  console.log(result);

  if (result.success) {
    // 성공
    console.log(result.data);
  } else {
    // 실패
    console.log(result.error.flatten());
    return result.error.flatten();
  }

};