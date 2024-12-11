import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { PageMeta } from "../../components/pageMeta ";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import {
  CreateDishMutation,
  CreateDishMutationVariables
} from "../../__generated__/types";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IFormProps {
  name: string;
  price: number;
  description: string;
}

export const AddDish: React.FC = () => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();

  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId
          }
        }
      }
    ]
  });

  const {
    register,
    getValues,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IFormProps>({
    mode: "onChange"
  });

  const onSubmit = () => {
    const { name, price, description } = getValues();

    createDishMutation({
      variables: {
        input: {
          name,
          price,
          description,
          restaurantId: +restaurantId
        }
      }
    });

    history.goBack();
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageMeta title="요리 추가" />

      <h4 className="font-semibold text-2xl mb-3">요리 추가</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container-input max-w-screen-sm"
      >
        <input
          {...register("name", {
            required: "음식 이름을 입력해 주세요."
          })}
          className="input"
          type="text"
          placeholder="음식 이름"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <input
          {...register("price", {
            required: "가격을 입력해 주세요.",
            valueAsNumber: true, // 값을 숫자로 변환
            min: {
              value: 0,
              message: "가격은 0 이상이어야 합니다."
            }
          })}
          className="input"
          type="number"
          placeholder="가격"
        />
        {errors.price?.message && (
          <FormError errorMessage={errors.price?.message} />
        )}
        <input
          {...register("description", {
            required: "음식의 설명을 입력해 주세요."
          })}
          className="input"
          type="text"
          placeholder="음식 설명"
        />
        {errors.description?.message && (
          <FormError errorMessage={errors.description?.message} />
        )}
        <Button loading={loading} canClick={isValid} actionText="요리 추가" />
      </form>
    </div>
  );
};
