import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import SocialLogin from "@/components/social-login";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원 가입을 위해 정보를 입력해 주세요.</h2>
      </div>
      <form action="" className="flex flex-col gap-3">
        <FormInput type="text" placeholder="이름" required={true} errors={[]} />
        <FormInput type="email" placeholder="이메일주소" required={true} errors={[]} />
        <FormInput type="password" placeholder="비밀번호" required={true} errors={[]} />
        <FormInput type="password" placeholder="비밀번호 확인" required={true} errors={[]} />
        <FormBtn text="계정 생성"  loading={false} />
      </form>
      <SocialLogin />
    </div>
  );
}