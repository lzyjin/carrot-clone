interface FormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
}

export default function FormInput({type, placeholder, required, errors}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-transparent rounded-md w-full h-10 border-none transition
          focus:outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500"
      />
      <span className="text-red-500 font-medium">{errors}</span>
    </div>
  );
}