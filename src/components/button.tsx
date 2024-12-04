interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText
}) => (
  <button
    role="button"
    className={`btn ${
      canClick
        ? "bg-lime-600 hover:bg-lime-700"
        : "bg-gray-300 pointer-events-none"
    }`}
  >
    {loading ? "로딩 중..." : actionText}
  </button>
);
