const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export const HOME_PATH = "/";
export const ABOUT_PATH = "/about";
export const CONTACT_PATH = "/contact";
export const POSTS_PATH = "/posts";
export const PROJECTS_PATH = "/projects";
export const ADMIN_PATH = "/admin";
export const LOGIN_PATH = "/login";

export const NAV_LINK_INDICES = [
  {
    name: "Home",
    path: HOME_PATH,
    tabIndex: 0,
  },
  {
    name: "Projects",
    path: PROJECTS_PATH,
    tabIndex: 1,
  },
  {
    name: "Posts",
    path: POSTS_PATH,
    tabIndex: 2,
  },
  {
    name: "About",
    path: ABOUT_PATH,
    tabIndex: 3,
  },
  {
    name: "Contact",
    path: CONTACT_PATH,
    tabIndex: 4,
  },
];

export const NAVBAR_HEIGHT = 82;
