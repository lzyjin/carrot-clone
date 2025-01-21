"use client";

import {useFormState} from "react-dom";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import FormButton from "@/components/form-btn";
import {handleForm} from "@/app/login/actions";

export default function Login() {
  // handleForm의 결과를 바탕으로 상태를 업데이트하기 위해 사용
  // state는 action의 결과(return값)
  const [state, formAction] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <FormInput type="email" name="email" placeholder="이메일주소" required={true} errors={state?.error ?? []} />
        <FormInput type="password" name="password" placeholder="비밀번호" required={true} errors={state?.error ?? []} />
        <FormButton text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}