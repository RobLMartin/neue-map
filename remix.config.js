import { flatRoutes } from "remix-flat-routes";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
  browserNodeBuiltinsPolyfill: {
    modules: {
      events: true,
      net: true,
      tls: true,
      string_decoder: true,
      url: true,
      util: true,
      crypto: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
