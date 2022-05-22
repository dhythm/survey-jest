import { getNow } from "..";
import baz, { bar, foo } from "../foo-bar-baz";

jest.mock("../foo-bar-baz", () => {
  const originalModule = jest.requireActual("../foo-bar-baz");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "mocked baz"),
    foo: "mocked foo",
  };
});

describe("getNow", () => {
  it("fix time by using spyOn", () => {
    const spy = jest.spyOn(Date, "now");
    spy.mockReturnValue(1577804400000);

    expect(getNow()).toBe(1577804400000);
    spy.mockRestore();
  });
});

describe("foo-bar-baz", () => {
  it("should do a partial mock", () => {
    const defaultExportResult = baz();
    expect(defaultExportResult).toBe("mocked baz");
    expect(baz).toHaveBeenCalled();

    expect(foo).toBe("mocked foo");
    expect(bar()).toBe("bar");
  });
});
