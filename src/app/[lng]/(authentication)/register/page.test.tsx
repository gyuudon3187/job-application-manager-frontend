import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import { useRouter } from "next/navigation";
import Registration from "./page";
import { authServer } from "@/mocks/server";
import { getRenderPage } from "@/utils/testutil";

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

      function buttonIsDisabled() {
        expect(button()).toBeDisabled();
      }

      async function fillField(fieldName: RegExp | string, input: string) {
        await userEvent.type(screen.getByLabelText(fieldName), input);
      }

      async function fillEmail(input: string) {
        await fillField(/mail/i, input);
      }

      async function fillPassword(input: string) {
        await fillField("Password", input);
      }

      async function fillConfirmPassword(input: string) {
        await fillField(/confirm/i, input);
      }

      const validEmail = "valid@email.com";
      async function fillValidEmail() {
        await fillEmail("valid@email.com");
      }

      const validPassword = "validPassword";
      async function fillSomePassword() {
        await fillPassword(validPassword);
      }

      async function fillCorresondingConfirmPassword() {
        await fillConfirmPassword(validPassword);
      }

      interface RegisterForm {
        email: string;
        password: string;
        confirmPassword: string;
      }

      async function fillForm(form: RegisterForm) {
        await fillEmail(form.email);
        await fillPassword(form.password);
        await fillConfirmPassword(form.confirmPassword);
      }

      async function fillValidForm() {
        await fillForm({
          email: validEmail,
          password: validPassword,
          confirmPassword: validPassword,
        });
      }

      it("renders", () => {
        expect(screen.getByText(/register/i)).toBeInTheDocument();
      });

      it("is disabled by default", () => {
        buttonIsDisabled();
      });

      type FillAndDisableTest = {
        name: string;
        fillFns: (() => Promise<void>)[];
      }[];

      const disabledAfterFillTests: FillAndDisableTest = [
        {
          name: "is disabled when only a valid email is provided",
          fillFns: [fillValidEmail],
        },
        {
          name: "is disabled when only password is provided",
          fillFns: [fillSomePassword],
        },
        {
          name: "is disabled when only confirm password is provided",
          fillFns: [fillCorresondingConfirmPassword],
        },
        {
          name: "is disabled when only a valid email and password are provided",
          fillFns: [fillValidEmail, fillSomePassword],
        },
        {
          name: "is disabled when only a valid email and confirm password are provided",
          fillFns: [fillValidEmail, fillCorresondingConfirmPassword],
        },
        {
          name: "is disabled when only a password and corresponding confirm password are provided",
          fillFns: [fillSomePassword, fillCorresondingConfirmPassword],
        },
        {
          name: "is disabled when a valid email is provided but the password (and confirm password) is too short",
          fillFns: [
            async () =>
              await fillForm({
                email: validEmail,
                password: "2short",
                confirmPassword: "2short",
              }),
          ],
        },
        {
          name: "is disabled when a valid email and password are provided but with incorrect confirm password",
          fillFns: [
            async () =>
              await fillForm({
                email: validEmail,
                password: validPassword,
                confirmPassword: "somethingDifferent",
              }),
          ],
        },
        {
          name: "is disabled when a password and corresponding confirm password are provided but with invalid email",
          fillFns: [
            async () =>
              await fillForm({
                email: "@email.com",
                password: validPassword,
                confirmPassword: validPassword,
              }),
          ],
        },
      ];

      disabledAfterFillTests.forEach((test) =>
        it(test.name, async () => {
          for (const fn of test.fillFns) {
            await fn();
          }
          buttonIsDisabled();
        }),
      );

      it("is enabled when all fields are filled with valid input", async () => {
        await fillValidForm();
        expect(button()).toBeEnabled();
      });

      async function submitForm(form: RegisterForm) {
        await fillForm(form);
        await userEvent.click(button());
      }

      async function submitValidForm() {
        await submitForm({
          email: validEmail,
          password: validPassword,
          confirmPassword: validPassword,
        });
      }

      it("shows signup complete message when enabled and clicked", async () => {
        await submitValidForm();
        await waitFor(() =>
          expect(screen.getByText("Signup Complete!")).toBeInTheDocument(),
        );
      });

      it("redirects user to root when enabled and clicked", async () => {
        await submitValidForm();
        expect(routerMock).toHaveBeenCalledTimes(1);
        expect(routerMock).toHaveBeenCalledWith("/");
      });
    });
  });
});
