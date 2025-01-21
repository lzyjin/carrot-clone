// server action

"use server";

// prevState는 처음에는 useFormState의 두번째 인자로 전달한 초기값,
// handleForm이 무언가를 반환한 뒤부터는 그 반환값
export const handleForm = async (prevState: any, formData: FormData) => {
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log("로그인 됌");
  console.log(prevState);
  // 서버액션에서 사용자가 입력한 값을 알기 위해 input에서 name 어트리뷰트값이 반드시 필요함.
  console.log(formData.get("email"), formData.get("password"));

  return {
    error: ["비밀번호가 틀립니다.", "비밀번호가 짧습니다."]
  };
};