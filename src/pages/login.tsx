import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { LoginMutation, LoginMutationVariables } from "../__generated__/types";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo_img.svg";

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

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token }
    } = data;

    if (ok && token) {
      console.log("📢 [login.tsx:35]", token);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted });

  const onSubmit = () => {
    if (!loading) {
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
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full"
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
              minLength: 5
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
            <FormError errorMessage=" 비밀번호는 5자 이상이어야 합니다." />
          )}
          <button className="btn">{loading ? "로딩 중..." : "로그인"}</button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult?.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
