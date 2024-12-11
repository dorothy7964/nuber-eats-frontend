import { useParams } from "react-router-dom";
import { PageMeta } from "../../components/pageMeta ";
import { gql, useMutation } from "@apollo/client";

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

export const AddDish: React.FC = () => {
  const { restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] = useMutation(CREATE_DISH_MUTATION);

  return (
    <div>
      <PageMeta title="요리 업로드" />
      <h1>요리 업로드</h1>
      <span>레스토랑 id - {restaurantId}</span>
    </div>
  );
};
