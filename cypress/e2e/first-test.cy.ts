describe("First Test", () => {
  it("홈페이지로 이동해야 합니다.", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "로그인 | Nuber Eats");
  });
});
