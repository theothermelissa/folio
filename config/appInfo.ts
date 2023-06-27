const port = process.env.APP_PORT || 3000;

const apiBasePath = "/api/auth/";

export const websiteDomain =
  process.env.BASE_URL_PATH ||
  process.env.NEXT_PUBLIC_APP_URL ||
  `http://localhost:${port}`;

export const appInfo = {
  appName: "Folio",
  websiteDomain,
  apiDomain: websiteDomain,
  apiBasePath,
};
