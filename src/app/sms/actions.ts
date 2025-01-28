"use server";

import {z} from "zod";
import validator from "validator";
import {SMS_TOKEN_MAX, SMS_TOKEN_MIN} from "@/lib/constants";
import {redirect} from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
// import twilio from "twilio";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";
import {sessionLogin} from "@/lib/utils";

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return !!exists;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "잘못된 형식입니다.");

const tokenSchema = z
  .coerce
  .number()
  .min(SMS_TOKEN_MIN)
  .max(SMS_TOKEN_MAX)
  .refine(tokenExists, "인증번호가 일치하지 않습니다.");

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(SMS_TOKEN_MIN, SMS_TOKEN_MAX).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  // db에 같은 토큰이 존재하면 랜덤한 토큰을 새로 생성함(재귀함수)
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

// prevState는 처음에는 useFormState의 두번째 인자로 전달한 초기값,
// form을 submit한 뒤부터는, 즉 form action인 서버액션 smsLogin이 무언가를 반환한 뒤부터는 prevState는 그 반환값임.
export const smsLogin = async (prevState: ActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token"); // number타입의 input이지만 string타입으로 넘어옴

  if (!prevState.token) {
    // 인증전(인증번호 없음, 전화번호만 입력함)
    const result = phoneSchema.safeParse(phone);

    if (result.success) {
      // 이전 인증번호 삭제
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          }
        }
      });

      // 새 인증번호 생성
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            // 포인트! smstoken을 생성하기 위해서는 user가 존재해야함.
            // 사용자로부터 받은 전화번호로 조회해서 db에 사용자가 있으면 연결, 없으면 새로 생성해서 user가 반드시 있게끔 처리
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              }
            }
          }
        },
      })

      // // twilio를 이용해서 전화번호로 토큰 전송
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: `[캐럿마켓] 인증번호: ${token}`,
      //   from: process.env.TWILIO_PHONE_NUMBER!,
      //   // to: result.data, // 사용자가 입력한 번호
      //   to: process.env.MY_PHONE_NUMBER!,
      // });

      // vonage를 이용해서 전화번호로 토큰 전송
      const credentials = new Auth({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET,
      });

      const vonage = new Vonage(credentials);
      await vonage.sms.send({
        text: `[Karrot Market] Your verification code is: : ${token}`,
        from: process.env.VONAGE_SMS_FROM!,
        //to: result.data,
        to: process.env.MY_PHONE_NUMBER!,
      });

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

  } else {
    // 인증번호 입력 후
    const result = await tokenSchema.safeParseAsync(token);
    const phoneResult = phoneSchema.safeParse(phone);

    if (!result.success) {
      console.log(result.error.flatten());

      // 인증번호는 그대로 보여야 하므로 token: true, 검증에 실패했기 때문에 에러메시지도 함꼐 전달
      return {
        token: true,
        error: result.error.flatten(),
      };

    } else {
      // 사용자가 입력한 토큰으로 db에서 user 조회
      const tokenDB = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
          user: {
            phone: phoneResult.data,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

      // user id로 사용자 로그인 처리
      if (tokenDB) {
        await sessionLogin(tokenDB.userId);

        // 인증이 끝났으니 db에 있는 토큰 삭제
        await db.sMSToken.delete({
          where: {
            id: tokenDB.id,
          },
        });

      }

      redirect("/profile");

    }

  }
};