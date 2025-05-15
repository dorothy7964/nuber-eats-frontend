interface ILogoutButtonProps {
  handleClick?: () => void;
}

export const LogoutButton: React.FC<ILogoutButtonProps> = ({ handleClick }) => {
  const handleLogout = () => {
    // 🧹 토큰 삭제
    localStorage.removeItem("nuber-token");

    // 💨 외부에서 온 핸들러도 실행 (옵션)
    if (handleClick) {
      handleClick();
    }

    // ✅ 알림창 띄우기
    alert("성공적으로 로그아웃되었습니다.");

    // ✅ 새로고침 + 홈으로 이동
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout} className="text-gray-500">
      로그아웃
    </button>
  );
};
