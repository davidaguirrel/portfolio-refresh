import { describe, expect, it } from "vitest";
import { addMissingProtocols } from "./bare-links";

describe("addMissingProtocols", () => {
  it("adds https:// to a bare LinkedIn address", () => {
    expect(
      addMissingProtocols("Find me at linkedin.com/in/david-aguirre-lopez."),
    ).toBe("Find me at https://linkedin.com/in/david-aguirre-lopez.");
  });

  it("handles www. and addresses in brackets", () => {
    expect(addMissingProtocols("(www.github.com/davidaguirrel)")).toBe(
      "(https://www.github.com/davidaguirrel)",
    );
  });

  it("leaves full URLs and emails alone", () => {
    const text =
      "See https://davidaguirre.tech/projects or write to contact@davidaguirre.tech";
    expect(addMissingProtocols(text)).toBe(text);
  });
});
