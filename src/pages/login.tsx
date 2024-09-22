import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoginMutation, LoginMutationVariables } from "../__generated__/types";
import { FormError } from "../components/form-error";
import { AuthForm } from "../layout/authForm";
import { LogoLayout } from "../layout/logoLayout";

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
    formState: { isValid, errors },
    handleSubmit
  } = useForm<ILoginForm>({ mode: "onChange" });

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
    <LogoLayout helmetTitle="로그인" title="다시 오신 것을 환영합니다.">
      <AuthForm
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        isValid={isValid}
        loading={loading}
        buttonText="로그인"
      >
        {loginMutationResult?.login.error && (
          <FormError errorMessage={loginMutationResult?.login.error} />
        )}
      </AuthForm>

      <div>
        계정이 없으신가요??{" "}
        <Link to="/create-account" className="text-lime-600 hover:underline">
          계정 만들기
        </Link>
      </div>
    </LogoLayout>
  );
};
