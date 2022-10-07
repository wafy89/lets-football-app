var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react"), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 12,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_react2 = require("@remix-run/react");

// app/utils/session.server.ts
var import_bcryptjs = __toESM(require("bcryptjs")), import_node = require("@remix-run/node");

// app/utils/db.server.ts
var import_client = require("@prisma/client"), db;
global.__db || (global.__db = new import_client.PrismaClient(), global.__db.$connect()), db = global.__db;

// app/utils/session.server.ts
async function login({
  username,
  password
}) {
  let user = await db.user.findUnique({
    where: { username }
  });
  return !user || !await import_bcryptjs.default.compare(
    password,
    user.passwordHash
  ) ? null : { id: user.id, username };
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "football-event-app",
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
async function createUserSession(userId) {
  let session = await storage.getSession();
  return session.set("userId", userId), (0, import_node.redirect)("/matches", {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  let userId = (await getUserSession(request)).get("userId");
  return !userId || typeof userId != "string" ? null : userId;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await (await getUserSession(request)).get("userId");
  if (!userId || typeof userId != "string") {
    let searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (typeof userId != "string")
    return null;
  try {
    return await db.user.findUnique({
      where: { id: userId }
    });
  } catch {
    throw logout(request);
  }
}
async function logout(request) {
  let session = await getUserSession(request);
  return (0, import_node.redirect)("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}
async function register({
  username,
  password,
  name,
  position
}) {
  let passwordHash = await import_bcryptjs.default.hash(password, 10);
  return { id: (await db.user.create({
    data: { username, passwordHash, name, position }
  })).id, username, name };
}

// app/styles/app.css
var app_default = "/build/_assets/app-ZGZLT4C5.css";

// app/root.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function links() {
  return [{ rel: "stylesheet", href: app_default }];
}
var meta = () => ({
  description: "App helps you to meet football mates",
  keywords: "football, meet, play, find people"
}), loader = async ({ request }) => ({
  user: await getUser(request)
});
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Document, {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 42,
        columnNumber: 5
      }, this)
    }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 4
    }, this)
  }, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 40,
    columnNumber: 3
  }, this);
}
function Document({ children, title = "Lets Football" }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", {
            charSet: "utf-8"
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 52,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", {
            name: "viewport",
            content: "width=device-width,initial-scale=1"
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 53,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 57,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 58,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("title", {
            children: title
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 59,
            columnNumber: 5
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 51,
        columnNumber: 4
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 63,
            columnNumber: 47
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 61,
        columnNumber: 4
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 50,
    columnNumber: 3
  }, this);
}
function Layout({ children }) {
  let loaderData = (0, import_react2.useLoaderData)(), user = (loaderData == null ? void 0 : loaderData.user) || { name: " " };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "mx-auto  px-2 text-red-50 sm:px-6 lg:px-8  bg-gray-800",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "relative flex h-16 items-center justify-between",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Link, {
              to: "/",
              className: "logo",
              children: "Lets F\u26BD\u26BDtball"
            }, void 0, !1, {
              fileName: "app/root.tsx",
              lineNumber: 77,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
              className: "relative flex h-16 items-center justify-between  gap-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
                  className: "p-1",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Link, {
                    to: "/matches",
                    children: "matches"
                  }, void 0, !1, {
                    fileName: "app/root.tsx",
                    lineNumber: 86,
                    columnNumber: 8
                  }, this)
                }, void 0, !1, {
                  fileName: "app/root.tsx",
                  lineNumber: 85,
                  columnNumber: 7
                }, this),
                user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
                  className: "p-1",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
                    action: "/logout",
                    method: "POST",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                      type: "submit",
                      className: "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      children: [
                        "Logout ",
                        user.name
                      ]
                    }, void 0, !0, {
                      fileName: "app/root.tsx",
                      lineNumber: 95,
                      columnNumber: 10
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/root.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                  }, this)
                }, void 0, !1, {
                  fileName: "app/root.tsx",
                  lineNumber: 90,
                  columnNumber: 8
                }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
                  className: "p-1",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Link, {
                    to: "/login",
                    children: "Login"
                  }, void 0, !1, {
                    fileName: "app/root.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                  }, this)
                }, void 0, !1, {
                  fileName: "app/root.tsx",
                  lineNumber: 104,
                  columnNumber: 8
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/root.tsx",
              lineNumber: 84,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/root.tsx",
          lineNumber: 76,
          columnNumber: 5
        }, this)
      }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 75,
        columnNumber: 4
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "container w-full mx-auto justify-center",
        children
      }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 111,
        columnNumber: 4
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 74,
    columnNumber: 3
  }, this);
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Document, {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, {
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
          children: "Error"
        }, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 120,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
          children: error.message
        }, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 121,
          columnNumber: 5
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 119,
      columnNumber: 4
    }, this)
  }, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 118,
    columnNumber: 3
  }, this);
}

// app/routes/matches.tsx
var matches_exports = {};
__export(matches_exports, {
  default: () => matches_default
});
var import_react3 = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function matches() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react3.Outlet, {}, void 0, !1, {
      fileName: "app/routes/matches.tsx",
      lineNumber: 6,
      columnNumber: 13
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/matches.tsx",
    lineNumber: 4,
    columnNumber: 9
  }, this);
}
var matches_default = matches;

// app/routes/matches/$matchId.tsx
var matchId_exports = {};
__export(matchId_exports, {
  action: () => action,
  default: () => MatchDetails,
  links: () => links2,
  loader: () => loader2
});
var import_node2 = require("@remix-run/node"), import_react4 = require("@remix-run/react");

// app/styles/match.css
var match_default = "/build/_assets/match-2QG5BDVL.css";

// app/routes/matches/$matchId.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), links2 = () => [{ rel: "stylesheet", href: match_default }];
async function loader2({ params, request }) {
  let userId = await getUserId(request) || void 0, match = await db.match.findUnique({
    where: { id: params.matchId },
    include: {
      userMatch: {
        include: {
          user: !0
        }
      }
    }
  }), creator = await db.user.findFirst({
    where: { id: match == null ? void 0 : match.creatorUserId }
  });
  if (!match)
    throw new Error("match not found");
  return {
    match,
    userId,
    creator
  };
}
var action = async ({ request, params }) => {
  let actionType = (await request.formData()).get("_action"), { matchId } = params, userId = await getUserId(request) || void 0;
  if (!userId)
    throw (0, import_node2.redirect)("/login");
  if (!!matchId)
    switch (actionType) {
      case "join":
        return await db.userMatch.create({
          data: {
            userId,
            matchId
          }
        }), null;
      case "leave":
        return await db.userMatch.delete({
          where: {
            matchId_userId: {
              userId,
              matchId
            }
          }
        }), (0, import_node2.redirect)("/matches");
      default:
        throw new Error("somthing went wrong with join/leave action");
    }
};
function MatchDetails() {
  let { match, userId, creator } = (0, import_react4.useLoaderData)(), usersInMatch = match.userMatch, isUserInMatch = () => usersInMatch.some(
    (user) => (user == null ? void 0 : user.userId) && user.userId === userId
  ), getAvailablePlaces = () => match.matchSize - match.playerRegistered;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "overflow-hidden bg-white shadow sm:rounded-t-lg mt-4",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "px-4 py-5 sm:px-6 flex justify-between align-middle",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
              className: "my-auto",
              children: [
                " Match Details : ",
                match.title
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 83,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "flex justify-end gap-2 align-middle",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Link, {
                  to: "/matches",
                  className: "flex-col justify-center",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                    className: "group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-500 focus:ring-offset-2",
                    name: "_action",
                    value: "leave",
                    children: "back"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/$matchId.tsx",
                    lineNumber: 89,
                    columnNumber: 8
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 85,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
                  method: "post",
                  children: isUserInMatch() ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                    className: "group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:bg-red-500 focus:ring-offset-2",
                    name: "_action",
                    value: "leave",
                    children: "Leave"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/$matchId.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                    className: "group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2",
                    type: "submit",
                    name: "_action",
                    value: "join",
                    children: "Join"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/$matchId.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 97,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 84,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/matches/$matchId.tsx",
          lineNumber: 82,
          columnNumber: 5
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/matches/$matchId.tsx",
        lineNumber: 81,
        columnNumber: 4
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "border-t border-gray-200",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "available Places :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 123,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: getAvailablePlaces()
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 126,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 122,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "match size :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 131,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: match.matchSize
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 132,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 130,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "Players registered :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 137,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: match.playerRegistered
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 140,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 136,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "Location :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 145,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: match.location
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 146,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 144,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "Date :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 151,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: new Date(match.date).toLocaleString()
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 152,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 150,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "Creator :"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 157,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Link, {
                    to: `/user/${creator.id}`,
                    children: creator.name
                  }, void 0, !1, {
                    fileName: "app/routes/matches/$matchId.tsx",
                    lineNumber: 159,
                    columnNumber: 8
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 158,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 156,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
                  className: "text-sm font-medium text-gray-500",
                  children: "Players joining:"
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 163,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 166,
                  columnNumber: 7
                }, this),
                match.userMatch.map((player) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
                  className: "ml-4 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Link, {
                    to: `/user/${player.user.id}`,
                    children: [
                      player.user.name,
                      " - ",
                      player.user.position
                    ]
                  }, void 0, !0, {
                    fileName: "app/routes/matches/$matchId.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/matches/$matchId.tsx",
                  lineNumber: 168,
                  columnNumber: 8
                }, this))
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/$matchId.tsx",
              lineNumber: 162,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/matches/$matchId.tsx",
          lineNumber: 121,
          columnNumber: 5
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/matches/$matchId.tsx",
        lineNumber: 120,
        columnNumber: 4
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/matches/$matchId.tsx",
    lineNumber: 80,
    columnNumber: 3
  }, this);
}

// app/routes/matches/index.tsx
var matches_exports2 = {};
__export(matches_exports2, {
  default: () => matches_default2,
  loader: () => loader3
});
var import_react5 = require("@remix-run/react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), loader3 = async () => ({
  matches: await db.match.findMany({
    orderBy: { date: "desc" },
    include: {
      userMatch: {
        include: {
          user: !0
        }
      }
    }
  })
});
function MatchList() {
  let { matches: matches2 } = (0, import_react5.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "px-4 py-5 sm:px-6 flex justify-between align-middle",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
            className: "my-auto",
            children: " Matches "
          }, void 0, !1, {
            fileName: "app/routes/matches/index.tsx",
            lineNumber: 28,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex justify-end gap-2 align-middle",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
              to: "/matches/new",
              className: "btn",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                className: "group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2",
                name: "_action",
                value: "leave",
                children: "Create Match"
              }, void 0, !1, {
                fileName: "app/routes/matches/index.tsx",
                lineNumber: 34,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/index.tsx",
              lineNumber: 30,
              columnNumber: 6
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/matches/index.tsx",
            lineNumber: 29,
            columnNumber: 5
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/matches/index.tsx",
        lineNumber: 27,
        columnNumber: 4
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
        children: matches2.map((match) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "p-6 w-full mx-auto  max-w-sm bg-white rounded-lg border border-gray-200 shadow-md ",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h5", {
              className: "mb-2 text-2xl font-bold tracking-tight text-gray-900 ",
              children: match.title
            }, void 0, !1, {
              fileName: "app/routes/matches/index.tsx",
              lineNumber: 50,
              columnNumber: 7
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
              className: "mb-3 font-normal text-gray-700 ",
              children: [
                " ",
                "Available Places: ",
                match.matchSize - match.userMatch.length,
                "/",
                match.matchSize
              ]
            }, void 0, !0, {
              fileName: "app/routes/matches/index.tsx",
              lineNumber: 53,
              columnNumber: 7
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("address", {
              className: "mb-6 font-normal text-sm text-gray-300 ",
              children: match.location
            }, void 0, !1, {
              fileName: "app/routes/matches/index.tsx",
              lineNumber: 58,
              columnNumber: 7
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
              to: match.id.toString(),
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                className: "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ",
                children: "Match Details"
              }, void 0, !1, {
                fileName: "app/routes/matches/index.tsx",
                lineNumber: 62,
                columnNumber: 8
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/index.tsx",
              lineNumber: 61,
              columnNumber: 7
            }, this)
          ]
        }, match.id, !0, {
          fileName: "app/routes/matches/index.tsx",
          lineNumber: 46,
          columnNumber: 6
        }, this))
      }, void 0, !1, {
        fileName: "app/routes/matches/index.tsx",
        lineNumber: 44,
        columnNumber: 4
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/matches/index.tsx",
    lineNumber: 26,
    columnNumber: 3
  }, this);
}
var matches_default2 = MatchList;

// app/routes/matches/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action2,
  default: () => new_default
});
var import_react6 = require("@remix-run/react"), import_node3 = require("@remix-run/node");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), action2 = async ({ request }) => {
  let userId = await requireUserId(request);
  if (!userId)
    return (0, import_node3.redirect)("/login");
  let formData = await request.formData(), formDate = formData.get("date");
  typeof formDate == "string" && formDate && (formDate = new Date(formDate));
  let match = {
    creatorUserId: userId,
    title: formData.get("title"),
    playerRegistered: 1,
    matchSize: Number(formData.get("matchSize")),
    location: formData.get("location"),
    date: new Date(formDate)
  };
  if (match.title, !Object.values(match).every(Boolean))
    throw new Error("there was a Problem creating a match");
  let newMatch = await db.match.create({ data: match });
  return await db.userMatch.create({
    data: {
      userId,
      matchId: newMatch.id
    }
  }), (0, import_node3.redirect)(`/matches/${newMatch.id}`);
};
function NewMatch() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "px-4 py-5 sm:px-6 flex justify-between align-middle",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
            className: "my-auto",
            children: "New Match"
          }, void 0, !1, {
            fileName: "app/routes/matches/new.tsx",
            lineNumber: 53,
            columnNumber: 5
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex justify-end gap-2 align-middle",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react6.Link, {
              to: "/matches",
              className: "btn btn-reverce",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                className: "group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-500 focus:ring-offset-2",
                name: "_action",
                value: "leave",
                children: "Back"
              }, void 0, !1, {
                fileName: "app/routes/matches/new.tsx",
                lineNumber: 59,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 55,
              columnNumber: 6
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/matches/new.tsx",
            lineNumber: 54,
            columnNumber: 5
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/matches/new.tsx",
        lineNumber: 52,
        columnNumber: 4
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "px-4 sm:px-6 max-w-lg mx-auto",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
          method: "POST",
          className: "mt-8 space-y-6",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "-space-y-px rounded-md shadow-sm",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "title",
                    children: " Title "
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 77,
                    columnNumber: 8
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    required: !0,
                    type: "text",
                    name: "title",
                    id: "title",
                    className: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 78,
                    columnNumber: 8
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/matches/new.tsx",
                lineNumber: 76,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 75,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "-space-y-px rounded-md shadow-sm",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "date",
                    children: " Date "
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 89,
                    columnNumber: 8
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    required: !0,
                    type: "datetime-local",
                    name: "date",
                    id: "date",
                    className: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 90,
                    columnNumber: 8
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/matches/new.tsx",
                lineNumber: 88,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 87,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "-space-y-px rounded-md shadow-sm",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "matchSize",
                    children: "Choose a Match Size:"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 101,
                    columnNumber: 8
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
                    required: !0,
                    name: "matchSize",
                    id: "matchSize",
                    itemType: "number",
                    className: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                        value: "10",
                        children: "10"
                      }, void 0, !1, {
                        fileName: "app/routes/matches/new.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                      }, this),
                      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                        value: "22",
                        children: "22"
                      }, void 0, !1, {
                        fileName: "app/routes/matches/new.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                      }, this)
                    ]
                  }, void 0, !0, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 102,
                    columnNumber: 8
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/matches/new.tsx",
                lineNumber: 100,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 99,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "-space-y-px rounded-md shadow-sm",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "location",
                    children: "Where will the Match be played"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 116,
                    columnNumber: 8
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
                    required: !0,
                    name: "location",
                    id: "location",
                    placeholder: `street 11, 
04103 Leipzig`,
                    className: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  }, void 0, !1, {
                    fileName: "app/routes/matches/new.tsx",
                    lineNumber: 117,
                    columnNumber: 8
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/matches/new.tsx",
                lineNumber: 115,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 114,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
              className: "group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2 ",
              children: "Create a Match"
            }, void 0, !1, {
              fileName: "app/routes/matches/new.tsx",
              lineNumber: 126,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/matches/new.tsx",
          lineNumber: 71,
          columnNumber: 5
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/matches/new.tsx",
        lineNumber: 70,
        columnNumber: 4
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/matches/new.tsx",
    lineNumber: 51,
    columnNumber: 3
  }, this);
}
var new_default = NewMatch;

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader4
});
var import_node4 = require("@remix-run/node");
var action3 = async ({ request }) => logout(request), loader4 = async () => (0, import_node4.redirect)("/");

// app/routes/signup.tsx
var signup_exports = {};
__export(signup_exports, {
  action: () => action4,
  default: () => Register
});
var import_node5 = require("@remix-run/node"), import_react7 = require("@remix-run/react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function validateUsername(username) {
  if (typeof username != "string" || username.length < 3)
    return "Usernames must be at least 3 characters long";
}
function validatePassword(password) {
  if (typeof password != "string" || password.length < 4)
    return "Passwords must be at least 6 characters long";
}
var action4 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), name = form.get("name"), position = form.get("position");
  if (typeof username != "string" || typeof password != "string" || typeof name != "string" || typeof position != "string")
    return badRequest({
      formError: "Form not submitted correctly."
    });
  let fields = { username, password, name, position }, fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });
  let userExists = await db.user.findFirst({
    where: { username }
  });
  if (userExists != null && userExists.id)
    return badRequest({
      fields,
      formError: `User with username ${username} already exists`
    });
  let user = await register(fields);
  return user ? createUserSession(user.id) : badRequest({
    fields,
    formError: "Something went wrong trying to create a new user."
  });
}, badRequest = (data) => (0, import_node5.json)(data, { status: 400 });
function Register() {
  let [searchParams] = (0, import_react7.useSearchParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "w-full max-w-md space-y-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
            className: "mt-6 text-center text-3xl font-bold tracking-tight text-gray-900",
            children: "Register a New User"
          }, void 0, !1, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 83,
            columnNumber: 6
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "page-content",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
              method: "post",
              className: "mt-8 space-y-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                  type: "hidden",
                  name: "redirectTo",
                  value: searchParams.get("redirectTo") ?? void 0
                }, void 0, !1, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 92,
                  columnNumber: 8
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  className: "-space-y-px rounded-md shadow-sm",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                        htmlFor: "username-input",
                        children: "Email address"
                      }, void 0, !1, {
                        fileName: "app/routes/signup.tsx",
                        lineNumber: 99,
                        columnNumber: 10
                      }, this),
                      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                        type: "text",
                        id: "username-input",
                        name: "username",
                        className: "relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                        placeholder: "Email address"
                      }, void 0, !1, {
                        fileName: "app/routes/signup.tsx",
                        lineNumber: 100,
                        columnNumber: 10
                      }, this)
                    ]
                  }, void 0, !0, {
                    fileName: "app/routes/signup.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 97,
                  columnNumber: 8
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                      htmlFor: "password-input",
                      children: "Password"
                    }, void 0, !1, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 110,
                      columnNumber: 9
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                      id: "password-input",
                      name: "password",
                      type: "password",
                      required: !0,
                      className: "relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    }, void 0, !1, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 111,
                      columnNumber: 9
                    }, this)
                  ]
                }, void 0, !0, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 109,
                  columnNumber: 8
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                      htmlFor: "name-input",
                      children: "Name"
                    }, void 0, !1, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 120,
                      columnNumber: 9
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                      type: "text",
                      id: "name-input",
                      name: "name",
                      required: !0,
                      className: "relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    }, void 0, !1, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 121,
                      columnNumber: 9
                    }, this)
                  ]
                }, void 0, !0, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 119,
                  columnNumber: 8
                }, this),
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                      htmlFor: "posistion-input",
                      children: "Position"
                    }, void 0, !1, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 130,
                      columnNumber: 9
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
                      id: "posistion-input",
                      name: "position",
                      required: !0,
                      className: "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                          disabled: !0,
                          value: "",
                          selected: !0,
                          children: "choose a position"
                        }, void 0, !1, {
                          fileName: "app/routes/signup.tsx",
                          lineNumber: 137,
                          columnNumber: 10
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                          value: "midfieder",
                          children: "Midfieder"
                        }, void 0, !1, {
                          fileName: "app/routes/signup.tsx",
                          lineNumber: 144,
                          columnNumber: 10
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                          value: "Striker",
                          children: "Striker"
                        }, void 0, !1, {
                          fileName: "app/routes/signup.tsx",
                          lineNumber: 145,
                          columnNumber: 10
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                          value: "diffender",
                          children: "Diffender"
                        }, void 0, !1, {
                          fileName: "app/routes/signup.tsx",
                          lineNumber: 146,
                          columnNumber: 10
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
                          value: "goalkeeper",
                          children: "Goal-keeper"
                        }, void 0, !1, {
                          fileName: "app/routes/signup.tsx",
                          lineNumber: 147,
                          columnNumber: 10
                        }, this)
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/signup.tsx",
                      lineNumber: 131,
                      columnNumber: 9
                    }, this)
                  ]
                }, void 0, !0, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 129,
                  columnNumber: 8
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                  className: "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  type: "submit",
                  children: "Create a User"
                }, void 0, !1, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 150,
                  columnNumber: 8
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 88,
              columnNumber: 7
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 87,
            columnNumber: 6
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 82,
        columnNumber: 5
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 81,
      columnNumber: 4
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/signup.tsx",
    lineNumber: 80,
    columnNumber: 3
  }, this);
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Home() {
}
var routes_default = Home;

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action5,
  default: () => Login
});
var import_node6 = require("@remix-run/node"), import_react8 = require("@remix-run/react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function validateUsername2(username) {
  if (typeof username != "string" || username.length < 3)
    return "Usernames must be at least 3 characters long";
}
function validatePassword2(password) {
  if (typeof password != "string" || password.length < 4)
    return "Passwords must be at least 6 characters long";
}
var badRequest2 = (data) => (0, import_node6.json)(data, { status: 400 }), action5 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password");
  if (typeof username != "string" || typeof password != "string")
    return badRequest2({
      formError: "Form not submitted correctly."
    });
  let fields = { username, password }, fieldErrors = {
    username: validateUsername2(username),
    password: validatePassword2(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest2({ fieldErrors, fields });
  let user = await login({ username, password });
  return user ? createUserSession(user.id) : badRequest2({
    fields,
    formError: "Username/Password combination is incorrect"
  });
};
function Login() {
  let [searchParams] = (0, import_react8.useSearchParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "w-full max-w-md space-y-8",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
              className: "mt-6 text-center text-3xl font-bold tracking-tight text-gray-900",
              children: "Sign in to your account"
            }, void 0, !1, {
              fileName: "app/routes/login.tsx",
              lineNumber: 72,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
              className: "mt-2 text-center text-sm text-gray-600",
              children: [
                "Or",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react8.Link, {
                  to: "/signup",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                    className: "font-medium text-indigo-600 hover:text-indigo-500",
                    children: "register a new User"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 78,
                    columnNumber: 8
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/login.tsx",
                  lineNumber: 77,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/login.tsx",
              lineNumber: 75,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 71,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
          className: "mt-8 space-y-6",
          method: "POST",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
              type: "hidden",
              name: "redirectTo",
              value: searchParams.get("redirectTo") ?? void 0
            }, void 0, !1, {
              fileName: "app/routes/login.tsx",
              lineNumber: 88,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "-space-y-px rounded-md shadow-sm",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                      className: "sr-only",
                      htmlFor: "username-input",
                      children: "Email address"
                    }, void 0, !1, {
                      fileName: "app/routes/login.tsx",
                      lineNumber: 95,
                      columnNumber: 8
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                      id: "username-input",
                      name: "username",
                      type: "email",
                      required: !0,
                      className: "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                      placeholder: "Email address"
                    }, void 0, !1, {
                      fileName: "app/routes/login.tsx",
                      lineNumber: 101,
                      columnNumber: 8
                    }, this)
                  ]
                }, void 0, !0, {
                  fileName: "app/routes/login.tsx",
                  lineNumber: 94,
                  columnNumber: 7
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                      htmlFor: "password-input",
                      className: "sr-only",
                      children: "Password"
                    }, void 0, !1, {
                      fileName: "app/routes/login.tsx",
                      lineNumber: 111,
                      columnNumber: 8
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                      id: "password-input",
                      name: "password",
                      type: "password",
                      required: !0,
                      className: "relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                      placeholder: "Password"
                    }, void 0, !1, {
                      fileName: "app/routes/login.tsx",
                      lineNumber: 117,
                      columnNumber: 8
                    }, this)
                  ]
                }, void 0, !0, {
                  fileName: "app/routes/login.tsx",
                  lineNumber: 110,
                  columnNumber: 7
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/login.tsx",
              lineNumber: 93,
              columnNumber: 6
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
                type: "submit",
                className: "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "absolute inset-y-0 left-0 flex items-center pl-3",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
                      className: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
                        "fill-rule": "evenodd",
                        d: "M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z",
                        "clip-rule": "evenodd"
                      }, void 0, !1, {
                        fileName: "app/routes/login.tsx",
                        lineNumber: 140,
                        columnNumber: 10
                      }, this)
                    }, void 0, !1, {
                      fileName: "app/routes/login.tsx",
                      lineNumber: 133,
                      columnNumber: 9
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 132,
                    columnNumber: 8
                  }, this),
                  "Sign in"
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 128,
                columnNumber: 7
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/login.tsx",
              lineNumber: 127,
              columnNumber: 6
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 84,
          columnNumber: 5
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 70,
      columnNumber: 4
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 69,
    columnNumber: 3
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "e51cd9fd", entry: { module: "/build/entry.client-MAZP4JSG.js", imports: ["/build/_shared/chunk-GQTMM3EC.js", "/build/_shared/chunk-BPQL3L3K.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-FW7KULHO.js", imports: ["/build/_shared/chunk-65B4HZGS.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-FBB3ZLDG.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-7WUJ3AGY.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-DOMDNNGV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/matches": { id: "routes/matches", parentId: "root", path: "matches", index: void 0, caseSensitive: void 0, module: "/build/routes/matches-T3APTQNP.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/matches/$matchId": { id: "routes/matches/$matchId", parentId: "routes/matches", path: ":matchId", index: void 0, caseSensitive: void 0, module: "/build/routes/matches/$matchId-VZW4DWKB.js", imports: ["/build/_shared/chunk-65B4HZGS.js", "/build/_shared/chunk-C6L53BW6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/matches/index": { id: "routes/matches/index", parentId: "routes/matches", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/matches/index-TXBEN7MI.js", imports: ["/build/_shared/chunk-C6L53BW6.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/matches/new": { id: "routes/matches/new", parentId: "routes/matches", path: "new", index: void 0, caseSensitive: void 0, module: "/build/routes/matches/new-LQHBCVXB.js", imports: ["/build/_shared/chunk-65B4HZGS.js", "/build/_shared/chunk-C6L53BW6.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-IIZJQSFV.js", imports: ["/build/_shared/chunk-C6L53BW6.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-E51CD9FD.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/matches": {
    id: "routes/matches",
    parentId: "root",
    path: "matches",
    index: void 0,
    caseSensitive: void 0,
    module: matches_exports
  },
  "routes/matches/$matchId": {
    id: "routes/matches/$matchId",
    parentId: "routes/matches",
    path: ":matchId",
    index: void 0,
    caseSensitive: void 0,
    module: matchId_exports
  },
  "routes/matches/index": {
    id: "routes/matches/index",
    parentId: "routes/matches",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: matches_exports2
  },
  "routes/matches/new": {
    id: "routes/matches/new",
    parentId: "routes/matches",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: signup_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
