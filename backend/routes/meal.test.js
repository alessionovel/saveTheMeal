const mealController = require("../controllers/meal");

const getSpy = jest.fn();
const postSpy = jest.fn();
const deleteSpy = jest.fn();

jest.doMock("express", () => {
  return {
    Router() {
      return {
        get: getSpy,
        post: postSpy,
        delete: deleteSpy,
      };
    },
  };
});

describe("should test meal router", () => {
  test("should test post meals", () => {
    require("./meal");
    expect(postSpy).toHaveBeenCalledWith("/meal", mealController.newMeal);
  });
  test("should test get meals", () => {
    require("./meal");
    expect(getSpy).toHaveBeenCalledWith("/meal", mealController.getAllMeal);
  });
  test("should test delete meals", () => {
    require("./meal");
    expect(deleteSpy).toHaveBeenCalledWith("/meal", mealController.deleteAllMeal);
  });
});
