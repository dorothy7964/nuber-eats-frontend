import { useForm } from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<IForm>();

  const onSubmit = () => {
    console.log("📢 onSubmit", watch());
  };

  const onInvalid = () => {
    console.log("계정을 생성할 수 없습니다.");
    console.log("📢 onInvalid : 계정을 생성할 수 없습니다.");
  };
  console.log("📢 errors", errors);
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register("email", {
              required: "이메일을 입력해 주세요.",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                message: "잘못된 이메일 형식입니다. Gmail 주소만 허용됩니다."
              }
            })}
            type="email"
            placeholder="email"
          />
          {typeof errors.email?.message === "string" && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div>
          <input
            {...register("password", {
              required: "비밀번호를 입력해 주세요."
            })}
            type="password"
            placeholder="password"
          />
          {typeof errors.password?.message === "string" && (
            <span className="font-bold text-red-600">
              {errors.password?.message}
            </span>
          )}
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  );
};
