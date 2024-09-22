import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { UserRole } from "../__generated__/types";
import { roleLabels } from "../common/userRole";
import { AuthForm } from "../layout/authForm";
import { LogoLayout } from "../layout/logoLayout";

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
    <LogoLayout
      helmetTitle="계정 만들기"
      title="계정을 만들어 주세요."
      question=" 이미 계정이 있으신가요?"
      linkText="지금 로그인"
      linkTo="/login"
    >
      <AuthForm
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        isValid={isValid}
        loading={false}
        buttonText="계정 만들기"
      >
        <select {...register("role")} className="input">
          {Object.keys(UserRole).map((roleKey, index) => {
            const roleValue = UserRole[roleKey as keyof typeof UserRole];
            return (
              <option key={index} value={roleValue}>
                {roleLabels[roleValue]}
              </option>
            );
          })}
        </select>
      </AuthForm>
    </LogoLayout>
  );
};
