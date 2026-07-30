import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // icon/apple-icon are Next.js's generated favicon routes (no file
  // extension in the URL despite serving an image) — must bypass locale
  // routing the same way /admin and /api already do.
  matcher: ["/((?!api|admin|icon|apple-icon|_next|.*\\..*).*)"],
};
