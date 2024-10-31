import { BASE_URL } from "@/utils/api";
import { http, HttpResponse } from "msw";

interface AuthRequestBody {
  email: string;
  password: string;
}

interface AuthSuccessResponseBody {
  token: string;
}

interface AuthFailureResponseBody {
  message: string;
}

type AuthResponseBody = AuthSuccessResponseBody | AuthFailureResponseBody;

const someToken = "some-token";

const handlers = [
  http.post<never, AuthRequestBody, AuthResponseBody>(
    `${BASE_URL}/signup/`,
    async ({ request }) => {
      const { email, password } = await request.json();
      if (email === "valid@email.com" && password == "validPassword") {
        return HttpResponse.json({ token: someToken });
      } else {
        return HttpResponse.json(
          { message: "INVALID_CREDENTIALS" },
          { status: 401 },
        );
      }
    },
  ),

  http.post<never, AuthRequestBody, AuthResponseBody>(
    `${BASE_URL}/login/`,
    async ({ request }) => {
      const { email, password } = await request.json();
      if (email === "valid@email.com" && password == "validPassword") {
        return HttpResponse.json({ token: someToken });
      } else {
        return HttpResponse.json(
          { message: "INVALID_CREDENTIALS" },
          { status: 401 },
        );
      }
    },
  ),

  http.get<never, never, AuthResponseBody>(
    `${BASE_URL}/authorize/`,
    ({ request }) => {
      const token = request.headers.get("authorization")?.split(" ", 2)[1];

      return HttpResponse.json({
        token: token === someToken ? token : "",
      });
    },
  ),
];

export default handlers;
