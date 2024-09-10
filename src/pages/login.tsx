import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../__generated__/types";

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    # (1) gql name을 재설정
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit
  } = useForm<ILoginForm>();

  const [loginMutation, { data }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  console.log("📢 [login.tsx:35]", data?.login.ok);

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          // GraphQL 쿼리에서 사용하는 변수 이름으로 맞춰서 변경
          email,
          password
        }
      }
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register("email", {
              required: "이메일을 입력해 주세요.",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                message: "잘못된 이메일 형식입니다. Gmail 주소만 허용됩니다."
              }
            })}
            required
            type="email"
            placeholder="email"
            className="input mb-3"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: 10
            })}
            required
            type="password"
            placeholder="password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage=" 비밀번호는 10자 이상이어야 합니다." />
          )}
          <button className="btn mt-3">Log In</button>
        </form>
      </div>
    </div>
  );
};
