import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { FormError } from "./form-error";

interface IFormProps {
  searchTerm: string;
}

export const FoodSearch: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<IFormProps>();

  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSearchSubmit)}
      className="bg-gray-800 w-full py-40 flex flex-col items-center justify-center"
    >
      <input
        {...register("searchTerm", {
          required: true,
          minLength: {
            value: 2,
            message: "검색어를 2자 이상 입력해주세요."
          }
        })}
        type="Search"
        placeholder="음식점 검색..."
        className="input rounded-md border-0 w-3/4 md:w-3/12 mb-2"
      />

      {errors.searchTerm?.message && (
        <FormError errorMessage={errors.searchTerm?.message} />
      )}
    </form>
  );
};
