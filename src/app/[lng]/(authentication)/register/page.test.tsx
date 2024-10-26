import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Registration from "./page";
import { authServer } from "@/mocks/server";
import {
  fillField,
  fillEmail,
  fillPassword,
  getRenderPage,
} from "@/utils/testutil";

const routerMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: routerMock,
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
      function passwordField() {
        return screen.getByLabelText("Password");
      }

      it("renders", () => {
        expect(passwordField()).toBeInTheDocument();
      });

      it("has hidden input", () => {
        expect(screen.getByLabelText("Password")).toHaveAttribute(
          "type",
          "password",
        );
      });
    });

    describe("Confirm password field", () => {
      function confirmPasswordField() {
        return screen.getByLabelText(/confirm/i);
      }

      it("renders", () => {
        expect(confirmPasswordField()).toBeInTheDocument();
      });

      it("has hidden input", () => {
        expect(confirmPasswordField()).toHaveAttribute("type", "password");
      });
    });

    describe("Register button", () => {
      function button() {
        return screen.getByText(/register/i);
      }

      async function fillConfirmPassword(input?: string) {
        await fillField(/confirm/i, input);
      }

      interface RegisterForm {
        email?: string;
        password?: string;
        confirmPassword?: string;
      }

      async function fillForm(form: RegisterForm) {
        await fillEmail(form.email);
        await fillPassword(form?.password);
        await fillConfirmPassword(form?.confirmPassword);
      }

      const validEmail = "valid@email.com";
      const validPassword = "validPassword";

      async function fillValidForm() {
        await fillForm({
          email: validEmail,
          password: validPassword,
          confirmPassword: validPassword,
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

        test("when only confirm password is provided", async () => {
          await fillForm({ confirmPassword: validPassword });
        });

        test("when only a valid email and password are provided", async () => {
          await fillForm({ email: validEmail, password: validPassword });
        });

        test("when only a valid email and confirm password are provided", async () => {
          await fillForm({ email: validEmail, confirmPassword: validPassword });
        });

        test("when only a password and corresponding confirm password are provided", async () => {
          await fillForm({
            password: validPassword,
            confirmPassword: validPassword,
          });
        });

        test("when a valid email is provided but the password (and confirm password) is too short", async () => {
          await fillForm({
            email: validEmail,
            password: "2short",
            confirmPassword: "2short",
          });
        });

        test("when a valid email and password are provided but with incorrect confirm password", async () => {
          await fillForm({
            email: validEmail,
            password: validPassword,
            confirmPassword: "somethingDifferent",
          });
        });

        test("when a password and corresponding confirm password are provided but with invalid email", async () => {
          await fillForm({
            email: "@email.com",
            password: validPassword,
            confirmPassword: validPassword,
          });
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
            confirmPassword: validPassword,
          });
          await userEvent.click(button());
        }

        beforeEach(async () => {
          await submitValidForm();
        });

        it("shows signup complete message", async () => {
          await waitFor(() =>
            expect(screen.getByText("Signup Complete!")).toBeInTheDocument(),
          );
        });

        it("redirects user to root when enabled and clicked", async () => {
          expect(routerMock).toHaveBeenCalledTimes(1);
          expect(routerMock).toHaveBeenCalledWith("/");
        });
      });
    });
  });
});
