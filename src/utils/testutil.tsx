import { render, waitFor, screen } from "@testing-library/react";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { ReactNode, Suspense } from "react";
import Loading from "../app/[lng]/_components/Loading";

function renderWithReactQueryProviderAndSuspense(component: ReactNode) {
  render(
    <ReactQueryProvider>
      <Suspense fallback={<Loading size={10} />}>{component}</Suspense>
    </ReactQueryProvider>,
  );
}

function renderWithAuth(component: ReactNode) {
  document.cookie = "token=some-token";
  renderWithReactQueryProviderAndSuspense(component);
  document.cookie = "token=;";
}

function renderWithoutAuth(component: ReactNode) {
  renderWithReactQueryProviderAndSuspense(component);
}

export async function renderWithLngAndMaybeAuthAndWaitForLoader(
  component: ReactNode,
  withAuth: boolean,
) {
  const renderer = withAuth ? renderWithAuth : renderWithoutAuth;
  renderer(component);

  await waitFor(() =>
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument(),
  );
}
