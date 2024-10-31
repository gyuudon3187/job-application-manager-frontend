import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "./page";
import { authServer } from "@/mocks/server";
import { fillEmail, fillPassword, getRenderPage } from "@/utils/testutil";

const routerMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: routerMock,
    };
  },
}));

// const spyLoStoSet

beforeAll(() => {
  authServer.listen();
});
afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  authServer.close();
});

const { renderPageWithAuth, renderPageWithoutAuth } = getRenderPage(Login);

describe("Login page", () => {
  describe("Page itself", () => {
    it("doesn't render when authorized", async () => {
      await renderPageWithAuth();

      expect(screen.queryByLabelText(/mail/i)).not.toBeInTheDocument();
    });
  });

  describe("Components", () => {
    beforeEach(async () => {
      await renderPageWithoutAuth();
    });

    describe("Email field", () => {
      it("renders", () => {
        expect(screen.getByLabelText(/mail/i)).toBeInTheDocument();
      });
    });

    describe("Password field", () => {
      function field() {
        return screen.getByLabelText("Password");
      }

      it("renders", () => {
        expect(field()).toBeInTheDocument();
      });

      it("has hidden input", () => {
        expect(screen.getByLabelText("Password")).toHaveAttribute(
          "type",
          "password",
        );
      });
    });

    describe("Login button", () => {
      function button() {
        return screen.getByText(/log in/i);
      }

      interface LoginForm {
        email?: string;
        password?: string;
      }

      async function fillForm(form: LoginForm) {
        await fillEmail(form.email);
        await fillPassword(form?.password);
      }

      const validEmail = "valid@email.com";
      const validPassword = "validPassword";

      async function fillValidForm() {
        await fillForm({
          email: validEmail,
          password: validPassword,
        });
      }

      it("renders", () => {
        expect(button()).toBeInTheDocument();
      });

      describe("is disabled", () => {
        afterEach(() => {
          expect(button()).toBeDisabled();
        });

        test("by default", () => {});

        test("when only a valid email is provided", async () => {
          await fillForm({ email: validEmail });
        });

        test("when only password is provided", async () => {
          await fillForm({ password: validPassword });
        });
      });

      it("is enabled when all fields are filled with valid input", async () => {
        await fillValidForm();
        expect(button()).toBeEnabled();
      });

      describe("when enabled and clicked", () => {
        async function submitValidForm() {
          await fillForm({
            email: validEmail,
            password: validPassword,
          });
          await userEvent.click(button());
        }

        beforeEach(async () => {
          await submitValidForm();
        });

        it("redirects user to root when enabled and clicked", async () => {
          expect(routerMock).toHaveBeenCalledTimes(1);
          expect(routerMock).toHaveBeenCalledWith("/");
        });
      });
    });
  });
});
