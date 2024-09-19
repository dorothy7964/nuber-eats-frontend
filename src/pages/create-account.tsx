import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { PageMeta } from "../components/pageMeta ";
import nuberLogo from "../images/logo_img.svg";
import { UserRole } from "../__generated__/types";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    watch,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client
    }
  });
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION);

  const onSubmit = () => {};
  console.log(watch());

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <PageMeta title="계정 만들기" />
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="logo" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          계정을 만들어 주세요.
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          {/* 이메일 */}
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
            placeholder="이메일"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {/* 비밀번호 */}
          <input
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: 5
            })}
            required
            type="password"
            placeholder="비밀번호"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage=" 비밀번호는 5자 이상이어야 합니다." />
          )}
          {/* 유저 타입  */}
          <select {...register("role")} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button canClick={isValid} loading={false} actionText="계정 만들기" />
        </form>
        <div>
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            지금 로그인
          </Link>
        </div>
      </div>
    </div>
  );
};
