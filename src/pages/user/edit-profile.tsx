import { gql, useApolloClient, useMutation } from "@apollo/client";
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
import { LogoutButton } from "../../components/logoutButton";

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
  const { data: userData } = useMe();
  const client = useApolloClient();

  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok }
    } = data;
    if (ok && userData) {
      /* 캐시 업데이트 */
      const {
        me: { email: prevEmail, id } // 이전 값이 캐시에 저장되어 있다.
      } = userData;

      const { email: newEmail } = getValues(); // 수정한 값

      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`, // 수정할 객체의 ID
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            // 캐시에 업데이트 할 값
            email: newEmail,
            verified: false
          }
        });
      }
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
    getValues,
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
        Object.entries(editData).filter(([, value]) => value !== "")
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

      <div className="mt-20 text-gray-500">
        <LogoutButton />
      </div>
    </AuthFormLayout>
  );
};
