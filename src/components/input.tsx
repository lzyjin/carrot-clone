import {InputHTMLAttributes} from "react";

interface FormInputProps {
  name: string; // HTMLInputElement가 기본으로 가지는 어트리뷰트라서 안적어도 되지만, FormInput 컴포넌트를 사용하는 곳에서 name을 까먹지 않게 ts가 경고를 하기 위해 추가함
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        key={name}
        name={name}
        {...rest}
        className="bg-transparent rounded-md w-full h-10 border-none transition
          focus:outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500"
      />
      {
        errors.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">{error}</span>
        ))
      }
    </div>
  );
}