const checkEmail = require("./utils").checkIfEmailInString;

describe("checkEmail test suite", () => {
  test("the string is an email", () => {
    const result = checkEmail("email@trento.it");
    expect(result).toBe(true);
  });

  test("the string isnt an email because misses the point", () => {
    const result = checkEmail("email@trento");
    expect(result).toBe(false);
  });
  test("the string isnt an email because misses the at", () => {
    const result = checkEmail("trento.it");
    expect(result).toBe(false);
  });
});
