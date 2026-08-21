import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("removes executable markup while preserving safe CMS formatting", () => {
    const result = sanitizeHtml(
      '<p>Hello <strong>member</strong></p><script>alert(1)</script><img src="x" onerror="alert(2)">'
    );

    expect(result).toContain("<strong>member</strong>");
    expect(result).not.toContain("<script");
    expect(result).not.toContain("onerror");
  });

  it("blocks unsafe URL protocols", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">Link</a>')).toBe(
      "<a>Link</a>"
    );
  });
});
