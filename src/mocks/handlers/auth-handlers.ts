import { BASE_URL } from "@/utils/api";
import { http, HttpResponse } from "msw";

interface SignupRequestBody {
  email: string;
  password: string;
}

interface SignupSuccessResponseBody {
  token: string;
}

interface SignupFailureResponseBody {
  message: string;
}

const handlers = [
  http.post<
    never,
    SignupRequestBody,
    SignupSuccessResponseBody | SignupFailureResponseBody
  >(`${BASE_URL}/signup/`, async ({ request }) => {
    const { email, password } = await request.json();
    if (email === "validUser" && password == "validPassword") {
      return HttpResponse.json({ token: "some-token" });
    } else {
      return HttpResponse.json(
        { message: "INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }
  }),

  http.get(`${BASE_URL}/authorize/`, ({ cookies }) => {
    const token = cookies.token;

    return HttpResponse.json({
      token: token === "some-token" ? token : "",
    });
  }),
];

export default handlers;
