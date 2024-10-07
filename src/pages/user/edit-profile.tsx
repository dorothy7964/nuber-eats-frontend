import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  EditProfileMutation,
  EditProfileMutationVariables
} from "../../__generated__/types";
import { PageMeta } from "../../components/pageMeta ";
import { Title } from "../../components/title";
import { useMe } from "../../hooks/useMe";
import { AuthForm } from "../../layout/authForm";
import { AuthFormLayout } from "../../layout/authFormLayout";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IEditFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch } = useMe();

  const onCompleted = async (data: EditProfileMutation) => {
    const {
      editProfile: { ok }
    } = data;
    if (ok && userData) {
      /* Query를 Refetch */
      await refetch();
    }
  };
  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted
  });

  const {
    register,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IEditFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email
    }
  });

  const onSubmit = (editData: IEditFormProps) => {
    if (!loading) {
      // 빈 값을 필터링 (빈 값이 없는 객체 출력)
      const filteredData = Object.fromEntries(
        Object.entries(editData).filter(([_, value]) => value !== "")
      );

      editProfile({
        variables: {
          input: filteredData
        }
      });
    }
  };

  return (
    <AuthFormLayout>
      <PageMeta title="프로필 편집" />
      <Title title="프로필 편집" />
      <AuthForm
        isRequire={false}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isValid={isValid}
        loading={loading}
        buttonText="프로필 저장"
      />
    </AuthFormLayout>
  );
};
