import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // uuid 라이브러리에서 v4 UUID 함수 가져오기
import {
  CreateDishMutation,
  CreateDishMutationVariables
} from "../../__generated__/types";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { PageMeta } from "../../components/pageMeta ";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

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
  [key: string]: string | number; // 동적 속성 처리
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
    setValue,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IFormProps>({
    mode: "onChange"
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();

    // 옵션 추가 object 형식의 배열로 변환 / 예: [{}, {}]
    const optionList = optionIds.map((theId: string) => ({
      name: rest[`${theId}-optionName`] as string,
      extra: +rest[`${theId}-optionExtra`]
    }));

    createDishMutation({
      variables: {
        input: {
          name,
          price,
          description,
          restaurantId: +restaurantId,
          options: optionList
        }
      }
    });

    history.goBack();
  };

  const [optionIds, setOptionIds] = useState<string[]>([]); // 상태는 UUID 문자열 배열

  const onAddOptionClick = () => {
    const UUID = uuidv4().replace(/-/g, ""); // 하이픈 제거
    setOptionIds((current) => [UUID, ...current]); // UUID 생성 후 배열 맨 앞에 추가
  };

  const onDeleteClick = (idToDelete: string) => {
    setOptionIds((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
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
          min="0" // HTML input의 min 속성 추가
          step="100" // 100원 단위 설정
          className="input"
          type="number"
          placeholder="가격"
        />
        {errors.price?.message && (
          <FormError errorMessage={errors.price?.message} />
        )}{" "}
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
        {/* 옵션 추가 */}
        <div className="my-10">
          <h4 className="font-semibold text-xl mb-3">요리 옵션</h4>
          <span
            onClick={onAddOptionClick}
            className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            요리 옵션 추가
          </span>
          {optionIds.length !== 0 &&
            optionIds.map((uuid: string) => (
              <div key={uuid} className="mt-5">
                <input
                  {...register(`${uuid}-optionName`, {
                    required: "옵션 이름을을 입력해 주세요."
                  })}
                  type="text"
                  placeholder="옵션 이름"
                  className="input-sm mr-3"
                />
                <input
                  {...register(`${uuid}-optionExtra`, {
                    required: "옵션 가격을을 입력해 주세요.",
                    min: {
                      value: 0,
                      message: "가격은 0 이상이어야 합니다."
                    }
                  })}
                  min="0" // HTML input의 min 속성 추가
                  step="100" // 100원 단위 설정
                  type="number"
                  placeholder="옵션 가격"
                  className="input-sm"
                />
                <button
                  role="button"
                  type="button"
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
                  onClick={() => onDeleteClick(uuid)}
                >
                  옵션 삭제
                </button>
                {/* 오류 메시지 출력 */}
                <p>
                  {errors[`${uuid}-optionName`] && (
                    <FormError
                      errorMessage={
                        errors[`${uuid}-optionName`]?.message as string
                      }
                    />
                  )}
                </p>
                <p>
                  {errors[`${uuid}-optionExtra`] && (
                    <FormError
                      errorMessage={
                        errors[`${uuid}-optionExtra`]?.message as string
                      }
                    />
                  )}
                </p>
              </div>
            ))}
        </div>
        <Button loading={loading} canClick={isValid} actionText="요리 추가" />
      </form>
    </div>
  );
};
