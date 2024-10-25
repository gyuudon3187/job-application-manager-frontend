import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Registration from "./page";
import { authServer } from "@/mocks/server";
import { getRenderPage } from "@/utils/testutil";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));
beforeAll(() => {
  authServer.listen();
});
afterAll(() => {
  authServer.close();
});

const { renderPageWithAuth, renderPageWithoutAuth } =
  getRenderPage(Registration);

describe("Signup page", () => {
  it("doesn't render when authorized", async () => {
    await renderPageWithAuth();

    expect(screen.queryByLabelText(/mail/i)).not.toBeInTheDocument();
  });

  describe("Email field", () => {
    it("renders", async () => {
      await renderPageWithoutAuth();

      expect(screen.getByLabelText(/mail/i)).toBeInTheDocument();
    });
  });
});
