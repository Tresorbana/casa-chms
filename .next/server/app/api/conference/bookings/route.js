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
exports.id = "app/api/conference/bookings/route";
exports.ids = ["app/api/conference/bookings/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fconference%2Fbookings%2Froute&page=%2Fapi%2Fconference%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconference%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fconference%2Fbookings%2Froute&page=%2Fapi%2Fconference%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconference%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Money_Casa_chms_src_app_api_conference_bookings_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/conference/bookings/route.ts */ \"(rsc)/./src/app/api/conference/bookings/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/conference/bookings/route\",\n        pathname: \"/api/conference/bookings\",\n        filename: \"route\",\n        bundlePath: \"app/api/conference/bookings/route\"\n    },\n    resolvedPagePath: \"D:\\\\Money\\\\Casa\\\\chms\\\\src\\\\app\\\\api\\\\conference\\\\bookings\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Money_Casa_chms_src_app_api_conference_bookings_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjb25mZXJlbmNlJTJGYm9va2luZ3MlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmNvbmZlcmVuY2UlMkZib29raW5ncyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmNvbmZlcmVuY2UlMkZib29raW5ncyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDTW9uZXklNUNDYXNhJTVDY2htcyU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q01vbmV5JTVDQ2FzYSU1Q2NobXMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ29CO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxNb25leVxcXFxDYXNhXFxcXGNobXNcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcY29uZmVyZW5jZVxcXFxib29raW5nc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY29uZmVyZW5jZS9ib29raW5ncy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NvbmZlcmVuY2UvYm9va2luZ3NcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2NvbmZlcmVuY2UvYm9va2luZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxNb25leVxcXFxDYXNhXFxcXGNobXNcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcY29uZmVyZW5jZVxcXFxib29raW5nc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fconference%2Fbookings%2Froute&page=%2Fapi%2Fconference%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconference%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/conference/bookings/route.ts":
/*!**************************************************!*\
  !*** ./src/app/api/conference/bookings/route.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\nasync function GET() {\n    try {\n        const bookings = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.conferenceBooking.findMany({\n            orderBy: {\n                startTime: 'desc'\n            },\n            include: {\n                conferenceRoom: true\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(bookings);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch conference bookings'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { conferenceRoomId, guestName, guestEmail, startTime, endTime, totalAmount } = body;\n        // Check availability\n        const conflict = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.conferenceBooking.findFirst({\n            where: {\n                conferenceRoomId,\n                status: 'CONFIRMED',\n                OR: [\n                    {\n                        startTime: {\n                            lte: new Date(startTime)\n                        },\n                        endTime: {\n                            gte: new Date(startTime)\n                        }\n                    },\n                    {\n                        startTime: {\n                            lte: new Date(endTime)\n                        },\n                        endTime: {\n                            gte: new Date(endTime)\n                        }\n                    }\n                ]\n            }\n        });\n        if (conflict) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Room is already booked for this time'\n            }, {\n                status: 409\n            });\n        }\n        const booking = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.conferenceBooking.create({\n            data: {\n                conferenceRoomId,\n                guestName,\n                guestEmail,\n                startTime: new Date(startTime),\n                endTime: new Date(endTime),\n                totalAmount: parseFloat(totalAmount)\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(booking);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to create conference booking'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9jb25mZXJlbmNlL2Jvb2tpbmdzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMEM7QUFDVDtBQUUxQixlQUFlRTtJQUNsQixJQUFJO1FBQ0EsTUFBTUMsV0FBVyxNQUFNRiwyQ0FBTUEsQ0FBQ0csaUJBQWlCLENBQUNDLFFBQVEsQ0FBQztZQUNyREMsU0FBUztnQkFBRUMsV0FBVztZQUFPO1lBQzdCQyxTQUFTO2dCQUFFQyxnQkFBZ0I7WUFBSztRQUNwQztRQUNBLE9BQU9ULHFEQUFZQSxDQUFDVSxJQUFJLENBQUNQO0lBQzdCLEVBQUUsT0FBT1EsT0FBTztRQUNaLE9BQU9YLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFzQyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUM3RjtBQUNKO0FBRU8sZUFBZUMsS0FBS0MsT0FBZ0I7SUFDdkMsSUFBSTtRQUNBLE1BQU1DLE9BQU8sTUFBTUQsUUFBUUosSUFBSTtRQUMvQixNQUFNLEVBQUVNLGdCQUFnQixFQUFFQyxTQUFTLEVBQUVDLFVBQVUsRUFBRVgsU0FBUyxFQUFFWSxPQUFPLEVBQUVDLFdBQVcsRUFBRSxHQUFHTDtRQUVyRixxQkFBcUI7UUFDckIsTUFBTU0sV0FBVyxNQUFNcEIsMkNBQU1BLENBQUNHLGlCQUFpQixDQUFDa0IsU0FBUyxDQUFDO1lBQ3REQyxPQUFPO2dCQUNIUDtnQkFDQUosUUFBUTtnQkFDUlksSUFBSTtvQkFDQTt3QkFDSWpCLFdBQVc7NEJBQUVrQixLQUFLLElBQUlDLEtBQUtuQjt3QkFBVzt3QkFDdENZLFNBQVM7NEJBQUVRLEtBQUssSUFBSUQsS0FBS25CO3dCQUFXO29CQUN4QztvQkFDQTt3QkFDSUEsV0FBVzs0QkFBRWtCLEtBQUssSUFBSUMsS0FBS1A7d0JBQVM7d0JBQ3BDQSxTQUFTOzRCQUFFUSxLQUFLLElBQUlELEtBQUtQO3dCQUFTO29CQUN0QztpQkFDSDtZQUNMO1FBQ0o7UUFFQSxJQUFJRSxVQUFVO1lBQ1YsT0FBT3JCLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBdUMsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzlGO1FBRUEsTUFBTWdCLFVBQVUsTUFBTTNCLDJDQUFNQSxDQUFDRyxpQkFBaUIsQ0FBQ3lCLE1BQU0sQ0FBQztZQUNsREMsTUFBTTtnQkFDRmQ7Z0JBQ0FDO2dCQUNBQztnQkFDQVgsV0FBVyxJQUFJbUIsS0FBS25CO2dCQUNwQlksU0FBUyxJQUFJTyxLQUFLUDtnQkFDbEJDLGFBQWFXLFdBQVdYO1lBQzVCO1FBQ0o7UUFFQSxPQUFPcEIscURBQVlBLENBQUNVLElBQUksQ0FBQ2tCO0lBQzdCLEVBQUUsT0FBT2pCLE9BQU87UUFDWixPQUFPWCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBc0MsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDN0Y7QUFDSiIsInNvdXJjZXMiOlsiRDpcXE1vbmV5XFxDYXNhXFxjaG1zXFxzcmNcXGFwcFxcYXBpXFxjb25mZXJlbmNlXFxib29raW5nc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL2RiJ1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYm9va2luZ3MgPSBhd2FpdCBwcmlzbWEuY29uZmVyZW5jZUJvb2tpbmcuZmluZE1hbnkoe1xyXG4gICAgICAgICAgICBvcmRlckJ5OiB7IHN0YXJ0VGltZTogJ2Rlc2MnIH0sXHJcbiAgICAgICAgICAgIGluY2x1ZGU6IHsgY29uZmVyZW5jZVJvb206IHRydWUgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGJvb2tpbmdzKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBjb25mZXJlbmNlIGJvb2tpbmdzJyB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXHJcbiAgICAgICAgY29uc3QgeyBjb25mZXJlbmNlUm9vbUlkLCBndWVzdE5hbWUsIGd1ZXN0RW1haWwsIHN0YXJ0VGltZSwgZW5kVGltZSwgdG90YWxBbW91bnQgfSA9IGJvZHlcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgYXZhaWxhYmlsaXR5XHJcbiAgICAgICAgY29uc3QgY29uZmxpY3QgPSBhd2FpdCBwcmlzbWEuY29uZmVyZW5jZUJvb2tpbmcuZmluZEZpcnN0KHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIGNvbmZlcmVuY2VSb29tSWQsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdDT05GSVJNRUQnLFxyXG4gICAgICAgICAgICAgICAgT1I6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogeyBsdGU6IG5ldyBEYXRlKHN0YXJ0VGltZSkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogeyBndGU6IG5ldyBEYXRlKHN0YXJ0VGltZSkgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHsgbHRlOiBuZXcgRGF0ZShlbmRUaW1lKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiB7IGd0ZTogbmV3IERhdGUoZW5kVGltZSkgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChjb25mbGljdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1Jvb20gaXMgYWxyZWFkeSBib29rZWQgZm9yIHRoaXMgdGltZScgfSwgeyBzdGF0dXM6IDQwOSB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYm9va2luZyA9IGF3YWl0IHByaXNtYS5jb25mZXJlbmNlQm9va2luZy5jcmVhdGUoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBjb25mZXJlbmNlUm9vbUlkLFxyXG4gICAgICAgICAgICAgICAgZ3Vlc3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgZ3Vlc3RFbWFpbCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogbmV3IERhdGUoc3RhcnRUaW1lKSxcclxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IG5ldyBEYXRlKGVuZFRpbWUpLFxyXG4gICAgICAgICAgICAgICAgdG90YWxBbW91bnQ6IHBhcnNlRmxvYXQodG90YWxBbW91bnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYm9va2luZylcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gY3JlYXRlIGNvbmZlcmVuY2UgYm9va2luZycgfSwgeyBzdGF0dXM6IDUwMCB9KVxyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJHRVQiLCJib29raW5ncyIsImNvbmZlcmVuY2VCb29raW5nIiwiZmluZE1hbnkiLCJvcmRlckJ5Iiwic3RhcnRUaW1lIiwiaW5jbHVkZSIsImNvbmZlcmVuY2VSb29tIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiUE9TVCIsInJlcXVlc3QiLCJib2R5IiwiY29uZmVyZW5jZVJvb21JZCIsImd1ZXN0TmFtZSIsImd1ZXN0RW1haWwiLCJlbmRUaW1lIiwidG90YWxBbW91bnQiLCJjb25mbGljdCIsImZpbmRGaXJzdCIsIndoZXJlIiwiT1IiLCJsdGUiLCJEYXRlIiwiZ3RlIiwiYm9va2luZyIsImNyZWF0ZSIsImRhdGEiLCJwYXJzZUZsb2F0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/conference/bookings/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXFDLEVBQUVILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsiRDpcXE1vbmV5XFxDYXNhXFxjaG1zXFxzcmNcXGxpYlxcZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fconference%2Fbookings%2Froute&page=%2Fapi%2Fconference%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconference%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();