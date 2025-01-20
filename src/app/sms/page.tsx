import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import SocialLogin from "@/components/social-login";

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
      </div>
      <form action="" className="flex flex-col gap-3">
        <FormInput type="text" placeholder="휴대폰 번호" required={true} errors={[]} />
        <FormInput type="number" placeholder="인증 번호" required={true} errors={[]} />
        <FormBtn text="휴대폰 번호 인증"  loading={false} />
      </form>
    </div>
  );
}