describe("계정 만들기", () => {
  const user = cy;

  it("이메일/비밀번호 유효성 검사의 오류를 표시해야 합니다.", () => {
    user.visit("/");

    user.findByText("계정 만들기").click();

    user.findByPlaceholderText("이메일").type("bad@mail");
    user.findByRole("alert").should("have.text", "잘못된 이메일 형식입니다.");

    user.findByPlaceholderText("이메일").clear();
    user.findByRole("alert").should("have.text", "이메일을 입력해 주세요.");

    user.findByPlaceholderText("이메일").type("real@email.com");
    user.findByPlaceholderText("비밀번호").type("error").clear();
    user.findByRole("alert").should("have.text", "비밀번호를 입력해 주세요.");
  });

  it("계정을 생성하고 로그인해야 합니다.", () => {
    // 계정 생성
    user.visit("/create-account");
    user.findByPlaceholderText("이메일").type("testClient10@mail.com");
    user.findByPlaceholderText("비밀번호").type("123123");
    user.findByRole("button").click();

    // 만든 계정으로 로그인
    user.wait(2000);
    user.findByPlaceholderText("이메일").type("testClient10@mail.com");
    user.findByPlaceholderText("비밀번호").type("123123");
    user.findByRole("button").click();
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
