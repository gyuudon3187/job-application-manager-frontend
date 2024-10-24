import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Registration from "./page";
import { authServer } from "@/mocks/server";
import { renderWithLngAndMaybeAuthAndWaitForLoader } from "@/utils/testutil";

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

async function renderPage(lng: string, withAuth: boolean) {
  await renderWithLngAndMaybeAuthAndWaitForLoader(
    <Registration params={{ lng: lng }} />,
    withAuth,
  );
}

async function renderWithAuthAndLng(lng: string) {
  await renderPage(lng, true);
}

async function renderWithoutAuthAndWithLng(lng: string) {
  await renderPage(lng, false);
}

async function renderPageWithAuth() {
  await renderPage("en", true);
}

async function renderPageWithoutAuth() {
  await renderPage("en", false);
}

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
