describe("로그인", () => {
  const user = cy;

  it("홈페이지로 이동해야 합니다.", () => {
    user.visit("/").title().should("eq", "로그인 | Nuber Eats");
  });

  it("이메일, 비밀번호 검증의 오류를 표시해야 합니다.", () => {
    user.visit("/");
    user.findByPlaceholderText("이메일").type("bad@email");
    user.findByRole("alert").should("have.text", "잘못된 이메일 형식입니다.");

    user.findByPlaceholderText("이메일").clear();
    user.findByRole("alert").should("have.text", "이메일을 입력해 주세요.");

    user.findByPlaceholderText("이메일").type("bad@email.com");
    user.findByPlaceholderText("비밀번호").type("error").clear();
    user.findByRole("alert").should("have.text", "비밀번호를 입력해 주세요.");
  });

  it("양식을 작성하고 로그인해야 합니다.", () => {
    user.login("client@mail.com", "123123");
  });
});
