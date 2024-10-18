interface PageButtonProps {
  page: number;
  totalPages?: number | undefined | null;
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
}

export const PageButton: React.FC<PageButtonProps> = ({
  page,
  totalPages,
  onNextPageClick,
  onPrevPageClick
}) => {
  if (totalPages === 0 || !totalPages) return;

  return (
    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
      <button
        onClick={onPrevPageClick}
        className="arrow-button"
        style={{ visibility: `${page > 1 ? "visible" : "hidden"}` }}
      >
        &larr;
      </button>

      <span>
        페이지 {page} 의 {totalPages}
      </span>

      <button
        onClick={onNextPageClick}
        className="arrow-button"
        style={{
          visibility: `${page !== totalPages ? "visible" : "hidden"}`
        }}
      >
        &rarr;
      </button>
    </div>
  );
};
