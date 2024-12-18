interface IButtonUploadFileProps {
  isImage: boolean;
  canClick: boolean;
  actionText: string;
}

export const ButtonUploadFile: React.FC<IButtonUploadFileProps> = ({
  isImage,
  canClick,
  actionText
}) => (
  <button
    role="button"
    className={`btn w-full py-2 px-4 ${canClick ? "bg-black" : "bg-gray-300"}`}
  >
    {isImage ? "이미지 변경하기" : actionText}
  </button>
);
