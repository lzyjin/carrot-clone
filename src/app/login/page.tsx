import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action="" className="flex flex-col gap-3">
        <FormInput type="email" placeholder="이메일주소" required={true} errors={[]} />
        <FormInput type="password" placeholder="비밀번호" required={true} errors={[]} />
        <FormBtn text="로그인"  loading={false} />
      </form>
      <SocialLogin />
    </div>
  );
}