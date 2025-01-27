"use server";

import {z} from "zod";
import {
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_MIN_LENGTH_ERROR, USERNAME_MAX_LENGTH_ERROR, REQUIRED_ERROR
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import getSession from "@/lib/session";

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
      }),
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
      }),
      // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    confirm_password: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .trim()
      .min(PASSWORD_MIN_LENGTH, {
        message: PASSWORD_MIN_LENGTH_ERROR
      })
  })
  .superRefine(async ({username}, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 이름입니다.",
        path: ["username"],
        fatal: true,
      });

      return z.NEVER;
    }
  })
  .superRefine(async ({email}, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 이메일입니다.",
        path: ["email"],
        fatal: true,
      });

      return z.NEVER;
    }
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

  const result = await schema.safeParseAsync(data);

  if (result.success) {
    // 이름과 이메일이 데이터베이스에 존재하는지 확인(zod에서 refine으로 확인) -> 둘 다 존재하지 않으면 계정생성 진행
    // 이 공간은 유효성 검사가 모두 끝난 행복한 공간이다!

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // 계정을 db에 저장
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      }
    });
    console.log(user);

    // 사용자 로그인 시킴(로그인 = 사용자에게 쿠키 줌 = 세션에 암호화한 사용자 아이디를 담은 쿠키 저장)
    const session = await getSession();
    session.id = user.id;

    await session.save();

    // 홈으로 리다이렉트
    redirect("/profile");

  } else {
    console.log(result.error.flatten());
    return result.error.flatten();
  }
};