"use client";

import {useFormState} from "react-dom";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import Button from "@/components/button";
import {login} from "@/app/(auth)/login/actions";

export default function Login() {
  // login(form의 action)의 결과를 바탕으로 상태를 업데이트하기 위해 사용
  // state는 action의 결과(return값)
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="이메일주소"
          required={true}
          errors={state?.fieldErrors.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          required={true}
          errors={state?.fieldErrors.password}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}