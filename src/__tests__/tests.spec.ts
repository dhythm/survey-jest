import { getNow } from "..";
import baz, { bar, foo } from "../foo-bar-baz";
import { toUpperCase } from "../utils";
import { toUpperCase as toUpperCaseOrg } from "../utils/converter";
import { getGrandchildName } from "../utils/more";
import { getChildName } from "../utils/more/child";
import { awakeChild, awakeGrandchild } from "../utils/parent";

describe("getNow", () => {
  it("fix time by using spyOn", () => {
    const spy = jest.spyOn(Date, "now");
    spy.mockReturnValue(1577804400000);

    expect(getNow()).toBe(1577804400000);
    spy.mockRestore();
  });
});

jest.mock("../foo-bar-baz", () => {
  const originalModule = jest.requireActual("../foo-bar-baz");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "mocked baz"),
    foo: "mocked foo",
  };
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

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  toUpperCase: jest
    .fn()
    .mockImplementation((arg) => "mocked ".concat(arg).toUpperCase()),
}));

describe("converter", () => {
  it("roll-up function should be mocked", () => {
    expect(toUpperCase("hello, world")).toBe("MOCKED HELLO, WORLD");
  });
  it("original function should NOT be mocked", () => {
    expect(toUpperCaseOrg("hello, world")).toBe("HELLO, WORLD");
  });
});

jest.mock("../utils/more");
// jest.mock("../utils/more/child");
const mockedGetChildName = getChildName as jest.MockedFunction<
  typeof getChildName
>;
const mockedGetGrandchildName = getGrandchildName as jest.MockedFunction<
  typeof getGrandchildName
>;

describe("parent", () => {
  /**
   * The following implementation will get `TypeError: mockedGetChildName.mockImplementation is not a function`,
   * because parent import not from `utils/more` but `utils/more/child` directly.
   * So, `../utils/more/child` should be mocked if you want to mock getChildName at this case.
   */
  // mockedGetChildName.mockImplementation(() => "Taro");
  mockedGetGrandchildName.mockImplementation(() => "Jiro");
  it("child should be mocked", () => {
    expect(awakeChild()).toBe("Wake up, John!");
    expect(awakeGrandchild()).toBe("Wake up, Jiro!");
  });
});
