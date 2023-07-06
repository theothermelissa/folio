const apiBasePath = "/api/auth/";

export const websiteDomain = process.env.NEXT_PUBLIC_BASE_URL_PATH;

export const appInfo = {
  appName: "Folio",
  websiteDomain,
  apiDomain: websiteDomain,
  apiBasePath,
};
