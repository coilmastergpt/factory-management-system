"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/issues/[id]/comments/route";
exports.ids = ["app/api/issues/[id]/comments/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&page=%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute.ts&appDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&page=%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute.ts&appDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_thoma_OneDrive_Line_app_api_issues_id_comments_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/issues/[id]/comments/route.ts */ \"(rsc)/./app/api/issues/[id]/comments/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/issues/[id]/comments/route\",\n        pathname: \"/api/issues/[id]/comments\",\n        filename: \"route\",\n        bundlePath: \"app/api/issues/[id]/comments/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\thoma\\\\OneDrive\\\\바탕 화면\\\\Line\\\\app\\\\api\\\\issues\\\\[id]\\\\comments\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_thoma_OneDrive_Line_app_api_issues_id_comments_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/issues/[id]/comments/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZpc3N1ZXMlMkYlNUJpZCU1RCUyRmNvbW1lbnRzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZpc3N1ZXMlMkYlNUJpZCU1RCUyRmNvbW1lbnRzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGaXNzdWVzJTJGJTVCaWQlNUQlMkZjb21tZW50cyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUN0aG9tYSU1Q09uZURyaXZlJTVDJUVCJUIwJTk0JUVEJTgzJTk1JTIwJUVEJTk5JTk0JUVCJUE5JUI0JTVDTGluZSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDdGhvbWElNUNPbmVEcml2ZSU1QyVFQiVCMCU5NCVFRCU4MyU5NSUyMCVFRCU5OSU5NCVFQiVBOSVCNCU1Q0xpbmUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDbUM7QUFDaEg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1R0FBdUc7QUFDL0c7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUM2Sjs7QUFFN0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYWN0b3J5LW1hbmFnZW1lbnQtc3lzdGVtLz80MDhkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHRob21hXFxcXE9uZURyaXZlXFxcXOuwlO2DlSDtmZTrqbRcXFxcTGluZVxcXFxhcHBcXFxcYXBpXFxcXGlzc3Vlc1xcXFxbaWRdXFxcXGNvbW1lbnRzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9pc3N1ZXMvW2lkXS9jb21tZW50cy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2lzc3Vlcy9baWRdL2NvbW1lbnRzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9pc3N1ZXMvW2lkXS9jb21tZW50cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHRob21hXFxcXE9uZURyaXZlXFxcXOuwlO2DlSDtmZTrqbRcXFxcTGluZVxcXFxhcHBcXFxcYXBpXFxcXGlzc3Vlc1xcXFxbaWRdXFxcXGNvbW1lbnRzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2lzc3Vlcy9baWRdL2NvbW1lbnRzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&page=%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute.ts&appDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/issues/[id]/comments/route.ts":
/*!***********************************************!*\
  !*** ./app/api/issues/[id]/comments/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/auth */ \"(rsc)/./app/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/prisma */ \"(rsc)/./app/lib/prisma.ts\");\n\n\n\n\n// 특정 이슈의 댓글 목록 조회\nasync function GET(request, { params }) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"인증이 필요합니다.\"\n            }, {\n                status: 401\n            });\n        }\n        const issueId = params.id;\n        // 이슈 존재 여부 확인\n        const issue = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].issue.findUnique({\n            where: {\n                id: issueId\n            }\n        });\n        if (!issue) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"이슈를 찾을 수 없습니다.\"\n            }, {\n                status: 404\n            });\n        }\n        // 임시 댓글 데이터 반환 (실제 DB 연동 전)\n        const mockComments = [\n            {\n                id: \"1\",\n                content: \"이 이슈는 빠른 해결이 필요합니다.\",\n                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),\n                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),\n                author: {\n                    id: \"user1\",\n                    name: \"김관리자\",\n                    email: \"admin@example.com\"\n                }\n            },\n            {\n                id: \"2\",\n                content: \"담당자 배정이 필요합니다.\",\n                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),\n                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),\n                author: {\n                    id: \"user2\",\n                    name: \"이엔지니어\",\n                    email: \"engineer@example.com\"\n                }\n            }\n        ];\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(mockComments);\n    } catch (error) {\n        console.error(\"댓글 조회 중 오류 발생:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"댓글 조회 중 오류가 발생했습니다.\"\n        }, {\n            status: 500\n        });\n    }\n}\n// 새 댓글 생성\nasync function POST(request, { params }) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session?.user) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"인증이 필요합니다.\"\n            }, {\n                status: 401\n            });\n        }\n        const issueId = params.id;\n        const data = await request.json();\n        // 필수 필드 검증\n        if (!data.content) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"댓글 내용은 필수입니다.\"\n            }, {\n                status: 400\n            });\n        }\n        // 이슈 존재 여부 확인\n        const issue = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].issue.findUnique({\n            where: {\n                id: issueId\n            }\n        });\n        if (!issue) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"이슈를 찾을 수 없습니다.\"\n            }, {\n                status: 404\n            });\n        }\n        // 임시 댓글 생성 응답 (실제 DB 연동 전)\n        const mockComment = {\n            id: `comment-${Date.now()}`,\n            content: data.content,\n            createdAt: new Date().toISOString(),\n            updatedAt: new Date().toISOString(),\n            author: {\n                id: \"current-user\",\n                name: \"현재 사용자\",\n                email: session.user.email || \"user@example.com\"\n            }\n        };\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(mockComment, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"댓글 생성 중 오류 발생:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"댓글 생성 중 오류가 발생했습니다.\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2lzc3Vlcy9baWRdL2NvbW1lbnRzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBd0Q7QUFDWDtBQUNNO0FBQ1A7QUFFNUMsa0JBQWtCO0FBQ1gsZUFBZUksSUFDcEJDLE9BQW9CLEVBQ3BCLEVBQUVDLE1BQU0sRUFBOEI7SUFFdEMsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTU4sMkRBQWdCQSxDQUFDQyxrREFBV0E7UUFDbEQsSUFBSSxDQUFDSyxTQUFTO1lBQ1osT0FBT1Asa0ZBQVlBLENBQUNRLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFhLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNsRTtRQUVBLE1BQU1DLFVBQVVMLE9BQU9NLEVBQUU7UUFFekIsY0FBYztRQUNkLE1BQU1DLFFBQVEsTUFBTVYsbURBQU1BLENBQUNVLEtBQUssQ0FBQ0MsVUFBVSxDQUFDO1lBQzFDQyxPQUFPO2dCQUFFSCxJQUFJRDtZQUFRO1FBQ3ZCO1FBRUEsSUFBSSxDQUFDRSxPQUFPO1lBQ1YsT0FBT2Isa0ZBQVlBLENBQUNRLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFpQixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDdEU7UUFFQSw0QkFBNEI7UUFDNUIsTUFBTU0sZUFBZTtZQUNuQjtnQkFDRUosSUFBSTtnQkFDSkssU0FBUztnQkFDVEMsV0FBVyxJQUFJQyxLQUFLQSxLQUFLQyxHQUFHLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxNQUFNQyxXQUFXO2dCQUNyRUMsV0FBVyxJQUFJSCxLQUFLQSxLQUFLQyxHQUFHLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxNQUFNQyxXQUFXO2dCQUNyRUUsUUFBUTtvQkFDTlgsSUFBSTtvQkFDSlksTUFBTTtvQkFDTkMsT0FBTztnQkFDVDtZQUNGO1lBQ0E7Z0JBQ0ViLElBQUk7Z0JBQ0pLLFNBQVM7Z0JBQ1RDLFdBQVcsSUFBSUMsS0FBS0EsS0FBS0MsR0FBRyxLQUFLLElBQUksS0FBSyxLQUFLLEtBQUssTUFBTUMsV0FBVztnQkFDckVDLFdBQVcsSUFBSUgsS0FBS0EsS0FBS0MsR0FBRyxLQUFLLElBQUksS0FBSyxLQUFLLEtBQUssTUFBTUMsV0FBVztnQkFDckVFLFFBQVE7b0JBQ05YLElBQUk7b0JBQ0pZLE1BQU07b0JBQ05DLE9BQU87Z0JBQ1Q7WUFDRjtTQUNEO1FBRUQsT0FBT3pCLGtGQUFZQSxDQUFDUSxJQUFJLENBQUNRO0lBQzNCLEVBQUUsT0FBT1AsT0FBTztRQUNkaUIsUUFBUWpCLEtBQUssQ0FBQyxrQkFBa0JBO1FBQ2hDLE9BQU9ULGtGQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFzQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUMzRTtBQUNGO0FBRUEsVUFBVTtBQUNILGVBQWVpQixLQUNwQnRCLE9BQW9CLEVBQ3BCLEVBQUVDLE1BQU0sRUFBOEI7SUFFdEMsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTU4sMkRBQWdCQSxDQUFDQyxrREFBV0E7UUFDbEQsSUFBSSxDQUFDSyxTQUFTcUIsTUFBTTtZQUNsQixPQUFPNUIsa0ZBQVlBLENBQUNRLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFhLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNsRTtRQUVBLE1BQU1DLFVBQVVMLE9BQU9NLEVBQUU7UUFDekIsTUFBTWlCLE9BQU8sTUFBTXhCLFFBQVFHLElBQUk7UUFFL0IsV0FBVztRQUNYLElBQUksQ0FBQ3FCLEtBQUtaLE9BQU8sRUFBRTtZQUNqQixPQUFPakIsa0ZBQVlBLENBQUNRLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFnQixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDckU7UUFFQSxjQUFjO1FBQ2QsTUFBTUcsUUFBUSxNQUFNVixtREFBTUEsQ0FBQ1UsS0FBSyxDQUFDQyxVQUFVLENBQUM7WUFDMUNDLE9BQU87Z0JBQUVILElBQUlEO1lBQVE7UUFDdkI7UUFFQSxJQUFJLENBQUNFLE9BQU87WUFDVixPQUFPYixrRkFBWUEsQ0FBQ1EsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQWlCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUN0RTtRQUVBLDJCQUEyQjtRQUMzQixNQUFNb0IsY0FBYztZQUNsQmxCLElBQUksQ0FBQyxRQUFRLEVBQUVPLEtBQUtDLEdBQUcsR0FBRyxDQUFDO1lBQzNCSCxTQUFTWSxLQUFLWixPQUFPO1lBQ3JCQyxXQUFXLElBQUlDLE9BQU9FLFdBQVc7WUFDakNDLFdBQVcsSUFBSUgsT0FBT0UsV0FBVztZQUNqQ0UsUUFBUTtnQkFDTlgsSUFBSTtnQkFDSlksTUFBTTtnQkFDTkMsT0FBT2xCLFFBQVFxQixJQUFJLENBQUNILEtBQUssSUFBSTtZQUMvQjtRQUNGO1FBRUEsT0FBT3pCLGtGQUFZQSxDQUFDUSxJQUFJLENBQUNzQixhQUFhO1lBQUVwQixRQUFRO1FBQUk7SUFDdEQsRUFBRSxPQUFPRCxPQUFPO1FBQ2RpQixRQUFRakIsS0FBSyxDQUFDLGtCQUFrQkE7UUFDaEMsT0FBT1Qsa0ZBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXNCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzNFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYWN0b3J5LW1hbmFnZW1lbnQtc3lzdGVtLy4vYXBwL2FwaS9pc3N1ZXMvW2lkXS9jb21tZW50cy9yb3V0ZS50cz9lZWMwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xyXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2xpYi9hdXRoJztcclxuaW1wb3J0IHByaXNtYSBmcm9tICcuLi8uLi8uLi8uLi9saWIvcHJpc21hJztcclxuXHJcbi8vIO2KueyglSDsnbTsiojsnZgg64yT6riAIOuqqeuhnSDsobDtmoxcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChcclxuICByZXF1ZXN0OiBOZXh0UmVxdWVzdCxcclxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfVxyXG4pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xyXG4gICAgaWYgKCFzZXNzaW9uKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAn7J247Kad7J20IO2VhOyalO2VqeuLiOuLpC4nIH0sIHsgc3RhdHVzOiA0MDEgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNzdWVJZCA9IHBhcmFtcy5pZDtcclxuXHJcbiAgICAvLyDsnbTsiogg7KG07J6sIOyXrOu2gCDtmZXsnbhcclxuICAgIGNvbnN0IGlzc3VlID0gYXdhaXQgcHJpc21hLmlzc3VlLmZpbmRVbmlxdWUoe1xyXG4gICAgICB3aGVyZTogeyBpZDogaXNzdWVJZCB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIWlzc3VlKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAn7J207IqI66W8IOywvuydhCDsiJgg7JeG7Iq164uI64ukLicgfSwgeyBzdGF0dXM6IDQwNCB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDsnoTsi5wg64yT6riAIOuNsOydtO2EsCDrsJjtmZggKOyLpOygnCBEQiDsl7Drj5kg7KCEKVxyXG4gICAgY29uc3QgbW9ja0NvbW1lbnRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICcxJyxcclxuICAgICAgICBjb250ZW50OiAn7J20IOydtOyKiOuKlCDruaDrpbgg7ZW06rKw7J20IO2VhOyalO2VqeuLiOuLpC4nLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDMgKiAyNCAqIDYwICogNjAgKiAxMDAwKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDMgKiAyNCAqIDYwICogNjAgKiAxMDAwKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgIGF1dGhvcjoge1xyXG4gICAgICAgICAgaWQ6ICd1c2VyMScsXHJcbiAgICAgICAgICBuYW1lOiAn6rmA6rSA66as7J6QJyxcclxuICAgICAgICAgIGVtYWlsOiAnYWRtaW5AZXhhbXBsZS5jb20nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICcyJyxcclxuICAgICAgICBjb250ZW50OiAn64u064u57J6QIOuwsOygleydtCDtlYTsmpTtlanri4jri6QuJyxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyICogMjQgKiA2MCAqIDYwICogMTAwMCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyICogMjQgKiA2MCAqIDYwICogMTAwMCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICBhdXRob3I6IHtcclxuICAgICAgICAgIGlkOiAndXNlcjInLFxyXG4gICAgICAgICAgbmFtZTogJ+ydtOyXlOyngOuLiOyWtCcsXHJcbiAgICAgICAgICBlbWFpbDogJ2VuZ2luZWVyQGV4YW1wbGUuY29tJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24obW9ja0NvbW1lbnRzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcign64yT6riAIOyhsO2ajCDspJEg7Jik66WYIOuwnOyDnTonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ+uMk+q4gCDsobDtmowg7KSRIOyYpOulmOqwgCDrsJzsg53tlojsirXri4jri6QuJyB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8g7IOIIOuMk+q4gCDsg53shLFcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoXHJcbiAgcmVxdWVzdDogTmV4dFJlcXVlc3QsXHJcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH1cclxuKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcclxuICAgIGlmICghc2Vzc2lvbj8udXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ+yduOymneydtCDtlYTsmpTtlanri4jri6QuJyB9LCB7IHN0YXR1czogNDAxIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlzc3VlSWQgPSBwYXJhbXMuaWQ7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XHJcblxyXG4gICAgLy8g7ZWE7IiYIO2VhOuTnCDqsoDspp1cclxuICAgIGlmICghZGF0YS5jb250ZW50KSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAn64yT6riAIOuCtOyaqeydgCDtlYTsiJjsnoXri4jri6QuJyB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOydtOyKiCDsobTsnqwg7Jes67aAIO2ZleyduFxyXG4gICAgY29uc3QgaXNzdWUgPSBhd2FpdCBwcmlzbWEuaXNzdWUuZmluZFVuaXF1ZSh7XHJcbiAgICAgIHdoZXJlOiB7IGlkOiBpc3N1ZUlkIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghaXNzdWUpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICfsnbTsiojrpbwg7LC+7J2EIOyImCDsl4bsirXri4jri6QuJyB9LCB7IHN0YXR1czogNDA0IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOyehOyLnCDrjJPquIAg7IOd7ISxIOydkeuLtSAo7Iuk7KCcIERCIOyXsOuPmSDsoIQpXHJcbiAgICBjb25zdCBtb2NrQ29tbWVudCA9IHtcclxuICAgICAgaWQ6IGBjb21tZW50LSR7RGF0ZS5ub3coKX1gLFxyXG4gICAgICBjb250ZW50OiBkYXRhLmNvbnRlbnQsXHJcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgYXV0aG9yOiB7XHJcbiAgICAgICAgaWQ6ICdjdXJyZW50LXVzZXInLFxyXG4gICAgICAgIG5hbWU6ICftmITsnqwg7IKs7Jqp7J6QJyxcclxuICAgICAgICBlbWFpbDogc2Vzc2lvbi51c2VyLmVtYWlsIHx8ICd1c2VyQGV4YW1wbGUuY29tJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihtb2NrQ29tbWVudCwgeyBzdGF0dXM6IDIwMSB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcign64yT6riAIOyDneyEsSDspJEg7Jik66WYIOuwnOyDnTonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ+uMk+q4gCDsg53shLEg7KSRIOyYpOulmOqwgCDrsJzsg53tlojsirXri4jri6QuJyB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4gIH1cclxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiR0VUIiwicmVxdWVzdCIsInBhcmFtcyIsInNlc3Npb24iLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJpc3N1ZUlkIiwiaWQiLCJpc3N1ZSIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsIm1vY2tDb21tZW50cyIsImNvbnRlbnQiLCJjcmVhdGVkQXQiLCJEYXRlIiwibm93IiwidG9JU09TdHJpbmciLCJ1cGRhdGVkQXQiLCJhdXRob3IiLCJuYW1lIiwiZW1haWwiLCJjb25zb2xlIiwiUE9TVCIsInVzZXIiLCJkYXRhIiwibW9ja0NvbW1lbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/issues/[id]/comments/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/auth.ts":
/*!*************************!*\
  !*** ./app/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getSession: () => (/* binding */ getSession)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./app/lib/prisma.ts\");\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__[\"default\"].user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token && session.user) {\n                session.user.id = token.id;\n            }\n            return session;\n        }\n    }\n};\nasync function getSession() {\n    return null; // 이 함수는 더 이상 사용하지 않음\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ2tFO0FBQ3RDO0FBQ0U7QUFFdkIsTUFBTUcsY0FBK0I7SUFDMUNDLFdBQVc7UUFDVEosMkVBQW1CQSxDQUFDO1lBQ2xCSyxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hDLE9BQU87b0JBQUVDLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQ3ZDQyxVQUFVO29CQUFFRixPQUFPO29CQUFZQyxNQUFNO2dCQUFXO1lBQ2xEO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVU7b0JBQ2pELE9BQU87Z0JBQ1Q7Z0JBRUEsTUFBTUUsT0FBTyxNQUFNViwrQ0FBTUEsQ0FBQ1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUNMUCxPQUFPRCxZQUFZQyxLQUFLO29CQUMxQjtnQkFDRjtnQkFFQSxJQUFJLENBQUNLLE1BQU07b0JBQ1QsT0FBTztnQkFDVDtnQkFFQSxNQUFNRyxrQkFBa0IsTUFBTWQscURBQWMsQ0FDMUNLLFlBQVlJLFFBQVEsRUFDcEJFLEtBQUtGLFFBQVE7Z0JBR2YsSUFBSSxDQUFDSyxpQkFBaUI7b0JBQ3BCLE9BQU87Z0JBQ1Q7Z0JBRUEsT0FBTztvQkFDTEUsSUFBSUwsS0FBS0ssRUFBRTtvQkFDWFosTUFBTU8sS0FBS1AsSUFBSTtvQkFDZkUsT0FBT0ssS0FBS0wsS0FBSztnQkFDbkI7WUFDRjtRQUNGO0tBQ0Q7SUFDRFcsU0FBUztRQUNQQyxVQUFVO0lBQ1o7SUFDQUMsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFWixJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUlksTUFBTVAsRUFBRSxHQUFHTCxLQUFLSyxFQUFFO1lBQ3BCO1lBQ0EsT0FBT087UUFDVDtRQUNBLE1BQU1OLFNBQVEsRUFBRUEsT0FBTyxFQUFFTSxLQUFLLEVBQUU7WUFDOUIsSUFBSUEsU0FBU04sUUFBUU4sSUFBSSxFQUFFO2dCQUN6Qk0sUUFBUU4sSUFBSSxDQUFDSyxFQUFFLEdBQUdPLE1BQU1QLEVBQUU7WUFDNUI7WUFDQSxPQUFPQztRQUNUO0lBQ0Y7QUFDRixFQUFFO0FBRUssZUFBZU87SUFDcEIsT0FBTyxNQUFNLHFCQUFxQjtBQUNwQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZhY3RvcnktbWFuYWdlbWVudC1zeXN0ZW0vLi9hcHAvbGliL2F1dGgudHM/NmJmYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnO1xyXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xyXG5pbXBvcnQgcHJpc21hIGZyb20gJy4vcHJpc21hJztcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XHJcbiAgICAgIG5hbWU6ICdDcmVkZW50aWFscycsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6ICdFbWFpbCcsIHR5cGU6ICdlbWFpbCcgfSxcclxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogJ1Bhc3N3b3JkJywgdHlwZTogJ3Bhc3N3b3JkJyB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xyXG4gICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKFxyXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXHJcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0pXHJcbiAgXSxcclxuICBzZXNzaW9uOiB7XHJcbiAgICBzdHJhdGVneTogJ2p3dCcsXHJcbiAgfSxcclxuICBwYWdlczoge1xyXG4gICAgc2lnbkluOiAnL2xvZ2luJyxcclxuICB9LFxyXG4gIGNhbGxiYWNrczoge1xyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcclxuICAgICAgaWYgKHRva2VuICYmIHNlc3Npb24udXNlcikge1xyXG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkIGFzIHN0cmluZztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2Vzc2lvbjtcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXNzaW9uKCkge1xyXG4gIHJldHVybiBudWxsOyAvLyDsnbQg7ZWo7IiY64qUIOuNlCDsnbTsg4Eg7IKs7Jqp7ZWY7KeAIOyViuydjFxyXG59ICJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiYmNyeXB0IiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInNlc3Npb24iLCJzdHJhdGVneSIsInBhZ2VzIiwic2lnbkluIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJnZXRTZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/prisma.ts":
/*!***************************!*\
  !*** ./app/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// PrismaClient 인스턴스를 전역 변수로 선언하여 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지\nconst globalForPrisma = global;\n// 개발 환경에서는 전역 변수를 사용하고, 프로덕션 환경에서는 새 인스턴스 생성\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQThDO0FBRTlDLDZEQUE2RDtBQUM3RCxNQUFNQyxrQkFBa0JDO0FBRXhCLDZDQUE2QztBQUN0QyxNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsR0FBRztBQUVuRSxJQUFJSSxJQUF5QixFQUFjSCxnQkFBZ0JFLE1BQU0sR0FBR0E7QUFFcEUsaUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mYWN0b3J5LW1hbmFnZW1lbnQtc3lzdGVtLy4vYXBwL2xpYi9wcmlzbWEudHM/NTE5YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XHJcblxyXG4vLyBQcmlzbWFDbGllbnQg7J247Iqk7YS07Iqk66W8IOyghOyXrSDrs4DsiJjroZwg7ISg7Ja47ZWY7JesIO2VqyDrpqzroZzrlKkg7IucIOyXrOufrCDsnbjsiqTthLTsiqTqsIAg7IOd7ISx65CY64qUIOqyg+ydhCDrsKnsp4BcclxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB9O1xyXG5cclxuLy8g6rCc67CcIO2ZmOqyveyXkOyEnOuKlCDsoITsl60g67OA7IiY66W8IOyCrOyaqe2VmOqzoCwg7ZSE66Gc642V7IWYIO2ZmOqyveyXkOyEnOuKlCDsg4gg7J247Iqk7YS07IqkIOyDneyEsVxyXG5leHBvcnQgY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByaXNtYTsgIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@babel","vendor-chunks/uuid","vendor-chunks/jose","vendor-chunks/next-auth","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&page=%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fissues%2F%5Bid%5D%2Fcomments%2Froute.ts&appDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cthoma%5COneDrive%5C%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4%5CLine&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();