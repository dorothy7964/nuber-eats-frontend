import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables
} from "../../__generated__/types";
import { useForm } from "react-hook-form";
import { PageMeta } from "../../components/pageMeta ";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient(); // hook을 사용해 client를 쓰기
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState(""); // 이미지 업로드 했을 때의 URL

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId }
    } = data;
    if (ok) {
      setUploading(false); // 업로드 완료 시 버튼 로딩 중 표시 끝

      const { name, address, categoryName } = getValues();

      // cache의 현재 state 읽기
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });

      // query 업데이트하기
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants, // cache에 기존 데이터
            restaurants: [
              {
                __typename: "Restaurant",
                id: restaurantId,
                name,
                coverImg: imageUrl,
                category: {
                  __typename: "Category",
                  name: categoryName
                },
                address,
                isPromoted: false
              }, // 새로운 데이터 업데이트
              ...queryResult.myRestaurants.restaurants // cache에 기존 데이터
            ]
          }
        }
      });

      history.push("/");
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });

  const {
    register,
    getValues,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IFormProps>({
    mode: "onChange"
  });

  // 버튼은 이미지 업로드를 시작한 순간 부터 Mutation이 끝날 때까지 로딩 중이라 표시 된다.
  const [uploading, setUploading] = useState(false);

  const onSubmit = async () => {
    setUploading(true); // 이미지 업로드 시작 순간 부터 버튼은 로딩 표시

    try {
      const { name, address, categoryName, file } = getValues();

      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);

      // 파일 업로드 후 서버 응답에서 URL 추출
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody
        })
      ).json();
      setImageUrl(coverImg);

      // GraphQL mutation을 실행하여 새로운 레스토랑 생성
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg
          }
        }
      });
    } catch (e) {
      console.error("📢 [add-restaurants.tsx:48]", e);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageMeta title="레스토랑 생성" />

      <h4 className="font-semibold text-2xl mb-3">레스토랑 추가하기</h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container-input max-w-screen-sm"
      >
        <input
          {...register("name", {
            required: "음식점명을 입력해 주세요."
          })}
          className="input"
          type="text"
          placeholder="음식점명"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <input
          {...register("address", {
            required: "음식점 주소를 입력해 주세요."
          })}
          className="input"
          type="text"
          placeholder="음식점 주소"
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address?.message} />
        )}
        <input
          {...register("categoryName", {
            required: "카테고리를 입력해 주세요."
          })}
          className="input"
          type="text"
          placeholder="카테고리"
        />
        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName?.message} />
        )}
        <input
          {...register("file", {
            required: "커버 이미지 파일을 선택해 주세요."
          })}
          type="file"
          accept="image/*" // 이미지 유형의 모든 확장자 파일 가능
          placeholder="파일"
        />
        {errors.file?.message && (
          <FormError errorMessage={errors.file?.message} />
        )}
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="레스토랑 생성"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
