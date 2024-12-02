describe("프로필 편집", () => {
  const user = cy;

  beforeEach(() => {
    user.login("client@mail.com", "123123");
  });

  it("헤더를 사용하여 /편집 프로필로 이동해야 합니다.", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000);
    user.assertTitle("프로필 편집");
  });

  it("이메일 편집이 가능해야 합니다.", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "client@mail.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText("이메일").clear().type("new@mail.com");
    user.findByRole("button").click();
  });
});
