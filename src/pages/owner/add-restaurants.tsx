import { gql, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables
} from "../../__generated__/types";
import { useForm } from "react-hook-form";
import { PageMeta } from "../../components/pageMeta ";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";

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
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { data, loading }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION);

  const {
    register,
    getValues,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IFormProps>({
    mode: "onChange"
  });

  const onSubmit = () => {
    console.log(getValues());
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
        <Button
          loading={loading}
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
