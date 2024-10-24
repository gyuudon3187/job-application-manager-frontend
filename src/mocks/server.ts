import { setupServer } from "msw/node";
import authHandlers from "./handlers/auth-handlers";
export const authServer = setupServer(...authHandlers);
