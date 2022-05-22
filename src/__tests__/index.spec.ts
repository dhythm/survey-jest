import { getNow } from "..";

describe("getNow", () => {
  it("fix time by using spyOn", () => {
    const spy = jest.spyOn(Date, "now");
    spy.mockReturnValue(1577804400000);

    expect(getNow()).toBe(1577804400000);
    spy.mockRestore();
  });
});
