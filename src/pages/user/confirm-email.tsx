import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables
} from "../../__generated__/types";
import { useMe } from "../../hooks/useMe";
import { useQueryParam } from "../../hooks/useQueryParam";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok }
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`, // 수정할 객체의 ID
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true // 캐시에 'verified' 필드를 true로 업데이트
        }
      });
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted
  });

  const code = useQueryParam("code");

  useEffect(() => {
    if (code) {
      verifyEmail({
        variables: {
          input: {
            code
          }
        }
      });
    }
  }, [code]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">이메일 확인 중...</h2>
      <h4 className="text-gray-700 text-sm">
        잠시만요, 이 페이지를 닫지 마세요...
      </h4>
    </div>
  );
};
