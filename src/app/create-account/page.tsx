"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import {useFormState} from "react-dom";
import {createAccount} from "@/app/create-account/actions";
import {USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH} from "@/lib/constants";

export default function CreateAccount() {
  const [state, formAction] = useFormState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원 가입을 위해 정보를 입력해 주세요.</h2>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <Input
          type="text"
          name="username"
          placeholder="이름"
          required={true}
          errors={state?.fieldErrors.username}
          maxLength={USERNAME_MAX_LENGTH}
        />
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
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          required={true}
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="계정 생성" />
      </form>
      <SocialLogin />
    </div>
  );
}