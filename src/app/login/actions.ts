// server action

"use server";

import {z} from "zod";
import {PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, PASSWORD_REGEX, PASSWORD_REGEX_ERROR} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import {redirect} from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !!user;
};

const schema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase()
    .refine(checkEmailExists, "이메일에 해당하는 계정이 존재하지 않습니다."),
  password: z
    .string()
    .trim()
    // .min(PASSWORD_MIN_LENGTH, {
    //   message: PASSWORD_MIN_LENGTH_ERROR
    // })
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await schema.safeParseAsync(data);

  if (result.success) {
    // 성공
    // 입력한 이메일로 db에서 회원 찾기(일종의 유효성검사이므로 zod에서 refine으로 함)
    // 입력한 비밀번호를 해싱해서 해시된 비밀번호로 db와 일치하는지 확인
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    console.log(ok);

    // 일치하면 로그인되어 /profile로 리다이렉트
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["비밀번호가 틀립니다."],
          email: [],
        }
      };
    }

  } else {
    // 실패
    // console.log(result.error.flatten());
    return result.error.flatten();
  }

};