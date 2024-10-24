import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Registration from "./page";
import { authServer } from "@/mocks/server";
import { renderWithoutAuth } from "@/utils/testutil";

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
beforeEach(() => {
  // jest.clearAllMocks()
});
afterAll(() => {
  authServer.close();
});

describe("Signup page", () => {
  describe("Email field", () => {
    it("renders", async () => {
      renderWithoutAuth(<Registration params={{ lng: "en" }} />);

      await waitFor(() =>
        expect(screen.queryByRole("status")).not.toBeInTheDocument(),
      );
      expect(screen.getByLabelText(/mail/i)).toBeInTheDocument();
    });
  });
});
