import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { ReactNode, Suspense, FunctionComponent, createElement } from "react";
import Loading from "../app/[lng]/_components/Loading";
import _ from "lodash-contrib";

export async function fillField(fieldName: RegExp | string, input?: string) {
  if (input) {
    await userEvent.type(screen.getByLabelText(fieldName), input);
  }
}

export async function fillEmail(input?: string) {
  await fillField(/mail/i, input);
}

export async function fillPassword(input?: string) {
  await fillField("Password", input);
}

export function getRenderPage(
  Page: FunctionComponent<{ params: { lng: string } }>,
) {
  function reactQueryProviderWrapper(component: ReactNode) {
    return <ReactQueryProvider>{component}</ReactQueryProvider>;
  }

  function suspenseLoadingWrapper(component: ReactNode) {
    return <Suspense fallback={<Loading size={10} />}>{component}</Suspense>;
  }

  function renderWithReactQueryProviderAndSuspense(component: ReactNode) {
    const pipeline = _.pipeline(
      suspenseLoadingWrapper,
      reactQueryProviderWrapper,
      render,
    );
    return pipeline(component);
  }

  function renderWithAuth(component: ReactNode) {
    localStorage.setItem("token", "some-token");
    renderWithReactQueryProviderAndSuspense(component);
    localStorage.removeItem("token");
  }

  function renderWithoutAuth(component: ReactNode) {
    renderWithReactQueryProviderAndSuspense(component);
  }

  async function renderWithLngAndMaybeAuthAndWaitForLoader(
    component: ReactNode,
    withAuth: boolean,
  ) {
    const renderer = withAuth ? renderWithAuth : renderWithoutAuth;
    renderer(component);

    await waitFor(() =>
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument(),
    );
  }

  async function renderPage(lng: string, withAuth: boolean) {
    await renderWithLngAndMaybeAuthAndWaitForLoader(
      createElement(Page, { params: { lng } }),
      withAuth,
    );
  }

  async function renderPageWithAuthAndLng(lng: string) {
    await renderPage(lng, true);
  }

  async function renderPageWithoutAuthAndWithLng(lng: string) {
    await renderPage(lng, false);
  }

  async function renderPageWithAuth() {
    await renderPage("en", true);
  }

  async function renderPageWithoutAuth() {
    await renderPage("en", false);
  }

  return {
    renderPageWithAuth,
    renderPageWithoutAuth,
    renderPageWithAuthAndLng,
    renderPageWithoutAuthAndWithLng,
  };
}
