import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import { LngProvider } from "@/utils/providers/LngContext";

function getHeadersGetMock(withAuth: boolean) {
  return (name: string) => {
    switch (name) {
      case "authorization":
        return withAuth ? "Bearer mockToken" : "";
      case "x-url":
        return "/en/some-url";
      default:
        return null;
    }
  };
}

const routerMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: routerMock,
    };
  },
}));
jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({
    get: jest.fn((name) => {
      return getHeadersGetMock(true)(name);
    }),
  })),
}));
jest.mock("../../../_i18n/client", () => ({
  useTranslation() {
    return {
      t: jest.fn((key) => {
        switch (key) {
          case "settings":
            return "Settings";
          case "signOut":
            return "Sign Out";
        }
      }),
    };
  },
}));
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Header", () => {
  const title = "Job Application Manager";

  function header() {
    return (
      <LngProvider lng="en">
        <Header title={title} />
      </LngProvider>
    );
  }

  describe("Page itself", () => {
    it("renders", () => {
      render(header());
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  describe("Components", () => {
    describe("Theme switcher", () => {
      it("renders", () => {
        render(header());
        expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
      });
    });

    describe("Language picker", () => {
      it("renders", () => {
        render(header());
        expect(screen.getByTestId("language-picker")).toBeInTheDocument();
      });
    });

    describe("User menu", () => {
      it("doesn't render when unauthenticated", () => {
        jest.mock("next/headers", () => ({
          headers: jest.fn(() => ({
            get: jest.fn((name) => {
              return getHeadersGetMock(false)(name);
            }),
          })),
        }));

        render(header());
        expect(screen.queryByText("Sign out")).not.toBeInTheDocument();
      });
    });

    it("renders when authenticated", () => {
      jest.mock("next/headers", () => ({
        headers: jest.fn(() => ({
          get: jest.fn((name) => {
            return getHeadersGetMock(true)(name);
          }),
        })),
      }));
      render(header());
      expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    });
  });
});
