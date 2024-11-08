import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole
} from "../__generated__/types";
import { roleLabels } from "../common/userRole";
import { AuthForm } from "../layout/authForm";
import { LogoLayout } from "../layout/logoLayout";
import { FormError } from "../components/form-error";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
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
    getValues,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client
    }
  });

  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok }
    } = data;
    if (ok) {
      alert("계정 생성! 지금 로그인하세요!");
      history.push("/");
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult }
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted
    }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role }
        }
      });
    }
  };
  console.log(watch());

  return (
    <LogoLayout
      helmetTitle="계정 만들기"
      title="계정을 만들어 주세요."
      question=" 이미 계정이 있으신가요?"
      linkText="지금 로그인"
      linkTo="/"
    >
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isValid={isValid}
        loading={loading}
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
        {createAccountMutationResult?.createAccount.error && (
          <FormError
            errorMessage={createAccountMutationResult.createAccount.error}
          />
        )}
      </AuthForm>
    </LogoLayout>
  );
};
