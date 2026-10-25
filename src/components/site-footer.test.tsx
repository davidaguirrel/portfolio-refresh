import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("gives each icon link an accessible name", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/davidaguirrel",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/david-aguirre-lopez/",
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:contact@davidaguirre.tech",
    );
  });
});
