import { setupWorker } from "msw/browser";
import authHandlers from "./handlers/auth-handlers";
export const authWorker = setupWorker(...authHandlers);
