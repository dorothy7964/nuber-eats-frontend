describe("로그인", () => {
  const user = cy;

  it("홈페이지로 이동해야 합니다.", () => {
    user.visit("/").title().should("eq", "로그인 | Nuber Eats");
  });

  it("Form에 내용을 입력해야 합니다.", () => {
    user.visit("/");
    user.findByPlaceholderText("이메일").type("test@mail.com");
    user.findByPlaceholderText("비밀번호").type("123123");
    user.findByRole("button").should("not.have.class", "pointer-events-none");
  });

  it("이메일, 비밀번호 검증의 오류를 표시해야 합니다.", () => {
    user.visit("/");
    user.findByPlaceholderText("이메일").type("bad@email");
    user.findByRole("alert").should("have.text", "잘못된 이메일 형식입니다.");
  });
});
