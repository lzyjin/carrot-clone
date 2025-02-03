"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import {useFormState} from "react-dom";
import {smsLogin} from "@/app/(auth)/sms/actions";
import {SMS_TOKEN_MAX, SMS_TOKEN_MIN} from "@/lib/constants";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, formAction] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인(휴대폰번호로 본인인증)</h1>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        {
          state.token
          ?
          <Input
            type="number"
            name="token"
            placeholder="인증 번호"
            required={true}
            errors={state.error?.formErrors}
            min={SMS_TOKEN_MIN}
            max={SMS_TOKEN_MAX}
          />
          :
          // 인증번호를 전송한 뒤 휴대폰 번호를 수정을 막기 위해 숨김
          <Input
            type="text"
            name="phone"
            placeholder="휴대폰 번호"
            required={true}
            errors={state.error?.formErrors}
          />
        }
        <Button text={state.token ? "인증하기" : "인증번호 전송"} />
      </form>
    </div>
  );
}