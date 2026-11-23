describe("Urban Monitoring - Login Test Suite", () => {
  let testData;

  before(() => {
    cy.fixture("testData").then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit("/login");
    cy.contains("Username / Email ID").should("be.visible");
  });

  const usernameField = () => cy.findByRole("textbox", { name: "Username / Email ID" });

  it("Should load the login page successfully", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).should("be.visible");
    cy.findByRole("textbox", { name: "Password" }).should("be.visible");
    cy.findByRole("button", { name: "Login" }).should("be.visible").and("be.enabled");
  });

  it("Should login with valid credentials", () => {
    cy.login(testData.validUser.username, testData.validUser.password);
    cy.location("pathname").should("not.eq", "/login");
  });

  it("Should redirect to dashboard after successful login", () => {
    cy.login(testData.validUser.username, testData.validUser.password);
    cy.location("pathname").should("not.eq", "/login");
  });

  it("Should mask password input", () => {
    cy.findByRole("textbox", { name: "Password" }).should("have.attr", "type", "password");
  });

  it("Should toggle password visibility", () => {
    cy.findByRole("textbox", { name: "Password" }).type("TestPassword123");
    cy.findByRole("button", { name: "Show" }).click();
    cy.get('input[name*="password" i], input[type="text"]').filter(':visible').first().should("be.visible");
  });

  it("Should login using Enter key", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type(testData.validUser.username);
    cy.findByRole("textbox", { name: "Password" }).type(testData.validUser.password, { log: false }).type("{enter}");
    cy.location("pathname").should("not.eq", "/login");
  });

  it("Should maintain authenticated session after refresh", () => {
    cy.login(testData.validUser.username, testData.validUser.password);
    cy.reload();
  });

  it("Should logout successfully", () => {
    cy.login(testData.validUser.username, testData.validUser.password);
  });

  it("Should reject invalid username", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type("invalid_user@example.com");
    cy.findByRole("textbox", { name: "Password" }).type("ValidPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should reject invalid password", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type(testData.validUser.username);
    cy.findByRole("textbox", { name: "Password" }).type("WrongPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should reject both invalid credentials", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type("invalid_user@example.com");
    cy.findByRole("textbox", { name: "Password" }).type("WrongPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should validate empty login fields", () => {
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should validate empty username", () => {
    cy.findByRole("textbox", { name: "Password" }).type("TestPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should validate empty password", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type("test@example.com");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should validate invalid email format", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type("invalid-email");
    cy.findByRole("textbox", { name: "Password" }).type("TestPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should handle leading and trailing spaces", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type("  invalid@example.com  ");
    cy.findByRole("textbox", { name: "Password" }).type("WrongPassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should validate password case sensitivity", () => {
    cy.findByRole("textbox", { name: "Username / Email ID" }).type(testData.validUser.username);
    cy.findByRole("textbox", { name: "Password" }).type("wrongpassword123");
    cy.findByRole("button", { name: "Login" }).click();
  });

  it("Should handle multiple invalid login attempts", () => {
    for (let i = 0; i < 5; i++) {
      cy.findByRole("textbox", { name: "Username / Email ID" }).clear().type("invalid@example.com");
      cy.findByRole("textbox", { name: "Password" }).clear().type("WrongPassword123");
      cy.findByRole("button", { name: "Login" }).click();
    }
  });

  it("Should prevent dashboard access without authentication", () => {
    cy.visit("/dashboard");
    cy.location("pathname").should("eq", "/login");
  });

  it("Should prevent protected content access after logout", () => {
    cy.visit("/dashboard");
    cy.location("pathname").should("eq", "/login");
  });
});