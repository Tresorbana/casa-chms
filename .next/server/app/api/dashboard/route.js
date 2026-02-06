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
exports.id = "app/api/dashboard/route";
exports.ids = ["app/api/dashboard/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Froute&page=%2Fapi%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Froute&page=%2Fapi%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Money_Casa_chms_src_app_api_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/dashboard/route.ts */ \"(rsc)/./src/app/api/dashboard/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/dashboard/route\",\n        pathname: \"/api/dashboard\",\n        filename: \"route\",\n        bundlePath: \"app/api/dashboard/route\"\n    },\n    resolvedPagePath: \"D:\\\\Money\\\\Casa\\\\chms\\\\src\\\\app\\\\api\\\\dashboard\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Money_Casa_chms_src_app_api_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkYXNoYm9hcmQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmRhc2hib2FyZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmRhc2hib2FyZCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDTW9uZXklNUNDYXNhJTVDY2htcyU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q01vbmV5JTVDQ2FzYSU1Q2NobXMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ1M7QUFDdEY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXE1vbmV5XFxcXENhc2FcXFxcY2htc1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxkYXNoYm9hcmRcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2Rhc2hib2FyZC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2Rhc2hib2FyZFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGFzaGJvYXJkL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcTW9uZXlcXFxcQ2FzYVxcXFxjaG1zXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGRhc2hib2FyZFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Froute&page=%2Fapi%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/dashboard/route.ts":
/*!****************************************!*\
  !*** ./src/app/api/dashboard/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\nasync function GET(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const dateStr = searchParams.get('date');\n        const targetDate = dateStr ? new Date(dateStr) : new Date();\n        targetDate.setHours(0, 0, 0, 0);\n        const nextDay = new Date(targetDate);\n        nextDay.setDate(targetDate.getDate() + 1);\n        // Room Status Grid with Dynamic Status for targetDate\n        const rooms = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.room.findMany({\n            orderBy: {\n                number: 'asc'\n            },\n            include: {\n                floor: true,\n                bookings: {\n                    where: {\n                        status: {\n                            in: [\n                                'CONFIRMED',\n                                'CHECKED_IN'\n                            ]\n                        },\n                        AND: [\n                            {\n                                checkIn: {\n                                    lt: nextDay\n                                }\n                            },\n                            {\n                                checkOut: {\n                                    gt: targetDate\n                                }\n                            }\n                        ]\n                    },\n                    include: {\n                        guest: true\n                    }\n                }\n            }\n        });\n        // Process rooms to determine dynamic status\n        const processedRooms = rooms.map((room)=>{\n            const activeBooking = room.bookings[0] // Since we filtered, the first one is the active one for this date\n            ;\n            return {\n                ...room,\n                displayStatus: activeBooking ? 'OCCUPIED' : 'AVAILABLE',\n                activeBooking: activeBooking || null\n            };\n        });\n        // Stats\n        const totalRooms = processedRooms.length;\n        const occupiedRooms = processedRooms.filter((r)=>r.displayStatus === 'OCCUPIED').length;\n        const occupancyRate = totalRooms > 0 ? occupiedRooms / totalRooms * 100 : 0;\n        // Bookings created TODAY (not for targetDate, but physical creation)\n        const today = new Date();\n        today.setHours(0, 0, 0, 0);\n        const bookingsCreatedToday = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.findMany({\n            where: {\n                createdAt: {\n                    gte: today\n                }\n            }\n        });\n        const revenueToday = bookingsCreatedToday.reduce((acc, booking)=>acc + booking.totalAmount, 0);\n        const pendingReservations = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.count({\n            where: {\n                status: 'PENDING'\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            stats: {\n                occupancyRate,\n                revenueToday,\n                pendingReservations\n            },\n            rooms: processedRooms\n        });\n    } catch (error) {\n        console.error(error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch dashboard data'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9kYXNoYm9hcmQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ1Q7QUFFMUIsZUFBZUUsSUFBSUMsT0FBZ0I7SUFDeEMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEdBQUcsSUFBSUMsSUFBSUYsUUFBUUcsR0FBRztRQUM1QyxNQUFNQyxVQUFVSCxhQUFhSSxHQUFHLENBQUM7UUFDakMsTUFBTUMsYUFBYUYsVUFBVSxJQUFJRyxLQUFLSCxXQUFXLElBQUlHO1FBQ3JERCxXQUFXRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUc7UUFFN0IsTUFBTUMsVUFBVSxJQUFJRixLQUFLRDtRQUN6QkcsUUFBUUMsT0FBTyxDQUFDSixXQUFXSyxPQUFPLEtBQUs7UUFFdkMsc0RBQXNEO1FBQ3RELE1BQU1DLFFBQVEsTUFBTWQsMkNBQU1BLENBQUNlLElBQUksQ0FBQ0MsUUFBUSxDQUFDO1lBQ3ZDQyxTQUFTO2dCQUFFQyxRQUFRO1lBQU07WUFDekJDLFNBQVM7Z0JBQ1BDLE9BQU87Z0JBQ1BDLFVBQVU7b0JBQ1JDLE9BQU87d0JBQ0xDLFFBQVE7NEJBQUVDLElBQUk7Z0NBQUM7Z0NBQWE7NkJBQWE7d0JBQUM7d0JBQzFDQyxLQUFLOzRCQUNIO2dDQUFFQyxTQUFTO29DQUFFQyxJQUFJaEI7Z0NBQVE7NEJBQUU7NEJBQzNCO2dDQUFFaUIsVUFBVTtvQ0FBRUMsSUFBSXJCO2dDQUFXOzRCQUFFO3lCQUNoQztvQkFDSDtvQkFDQVcsU0FBUzt3QkFDUFcsT0FBTztvQkFDVDtnQkFDRjtZQUNGO1FBQ0Y7UUFFQSw0Q0FBNEM7UUFDNUMsTUFBTUMsaUJBQWlCakIsTUFBTWtCLEdBQUcsQ0FBQ2pCLENBQUFBO1lBQy9CLE1BQU1rQixnQkFBZ0JsQixLQUFLTSxRQUFRLENBQUMsRUFBRSxDQUFDLG1FQUFtRTs7WUFDMUcsT0FBTztnQkFDTCxHQUFHTixJQUFJO2dCQUNQbUIsZUFBZUQsZ0JBQWdCLGFBQWE7Z0JBQzVDQSxlQUFlQSxpQkFBaUI7WUFDbEM7UUFDRjtRQUVBLFFBQVE7UUFDUixNQUFNRSxhQUFhSixlQUFlSyxNQUFNO1FBQ3hDLE1BQU1DLGdCQUFnQk4sZUFBZU8sTUFBTSxDQUFDQyxDQUFBQSxJQUFLQSxFQUFFTCxhQUFhLEtBQUssWUFBWUUsTUFBTTtRQUN2RixNQUFNSSxnQkFBZ0JMLGFBQWEsSUFBSSxnQkFBaUJBLGFBQWMsTUFBTTtRQUU1RSxxRUFBcUU7UUFDckUsTUFBTU0sUUFBUSxJQUFJaEM7UUFDbEJnQyxNQUFNL0IsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHO1FBQ3hCLE1BQU1nQyx1QkFBdUIsTUFBTTFDLDJDQUFNQSxDQUFDMkMsT0FBTyxDQUFDM0IsUUFBUSxDQUFDO1lBQ3pETSxPQUFPO2dCQUNMc0IsV0FBVztvQkFBRUMsS0FBS0o7Z0JBQU07WUFDMUI7UUFDRjtRQUVBLE1BQU1LLGVBQWVKLHFCQUFxQkssTUFBTSxDQUFDLENBQUNDLEtBQWFMLFVBQWlCSyxNQUFNTCxRQUFRTSxXQUFXLEVBQUU7UUFFM0csTUFBTUMsc0JBQXNCLE1BQU1sRCwyQ0FBTUEsQ0FBQzJDLE9BQU8sQ0FBQ1EsS0FBSyxDQUFDO1lBQ3JEN0IsT0FBTztnQkFBRUMsUUFBUTtZQUFVO1FBQzdCO1FBRUEsT0FBT3hCLHFEQUFZQSxDQUFDcUQsSUFBSSxDQUFDO1lBQ3ZCQyxPQUFPO2dCQUNMYjtnQkFDQU07Z0JBQ0FJO1lBQ0Y7WUFDQXBDLE9BQU9pQjtRQUNUO0lBQ0YsRUFBRSxPQUFPdUIsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUNBO1FBQ2QsT0FBT3ZELHFEQUFZQSxDQUFDcUQsSUFBSSxDQUFDO1lBQUVFLE9BQU87UUFBaUMsR0FBRztZQUFFL0IsUUFBUTtRQUFJO0lBQ3RGO0FBQ0YiLCJzb3VyY2VzIjpbIkQ6XFxNb25leVxcQ2FzYVxcY2htc1xcc3JjXFxhcHBcXGFwaVxcZGFzaGJvYXJkXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL2RiJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybClcbiAgICBjb25zdCBkYXRlU3RyID0gc2VhcmNoUGFyYW1zLmdldCgnZGF0ZScpXG4gICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRhdGVTdHIgPyBuZXcgRGF0ZShkYXRlU3RyKSA6IG5ldyBEYXRlKClcbiAgICB0YXJnZXREYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApXG5cbiAgICBjb25zdCBuZXh0RGF5ID0gbmV3IERhdGUodGFyZ2V0RGF0ZSlcbiAgICBuZXh0RGF5LnNldERhdGUodGFyZ2V0RGF0ZS5nZXREYXRlKCkgKyAxKVxuXG4gICAgLy8gUm9vbSBTdGF0dXMgR3JpZCB3aXRoIER5bmFtaWMgU3RhdHVzIGZvciB0YXJnZXREYXRlXG4gICAgY29uc3Qgcm9vbXMgPSBhd2FpdCBwcmlzbWEucm9vbS5maW5kTWFueSh7XG4gICAgICBvcmRlckJ5OiB7IG51bWJlcjogJ2FzYycgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgZmxvb3I6IHRydWUsXG4gICAgICAgIGJvb2tpbmdzOiB7XG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIHN0YXR1czogeyBpbjogWydDT05GSVJNRUQnLCAnQ0hFQ0tFRF9JTiddIH0sXG4gICAgICAgICAgICBBTkQ6IFtcbiAgICAgICAgICAgICAgeyBjaGVja0luOiB7IGx0OiBuZXh0RGF5IH0gfSxcbiAgICAgICAgICAgICAgeyBjaGVja091dDogeyBndDogdGFyZ2V0RGF0ZSB9IH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICAgIGd1ZXN0OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFByb2Nlc3Mgcm9vbXMgdG8gZGV0ZXJtaW5lIGR5bmFtaWMgc3RhdHVzXG4gICAgY29uc3QgcHJvY2Vzc2VkUm9vbXMgPSByb29tcy5tYXAocm9vbSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVCb29raW5nID0gcm9vbS5ib29raW5nc1swXSAvLyBTaW5jZSB3ZSBmaWx0ZXJlZCwgdGhlIGZpcnN0IG9uZSBpcyB0aGUgYWN0aXZlIG9uZSBmb3IgdGhpcyBkYXRlXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5yb29tLFxuICAgICAgICBkaXNwbGF5U3RhdHVzOiBhY3RpdmVCb29raW5nID8gJ09DQ1VQSUVEJyA6ICdBVkFJTEFCTEUnLFxuICAgICAgICBhY3RpdmVCb29raW5nOiBhY3RpdmVCb29raW5nIHx8IG51bGxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gU3RhdHNcbiAgICBjb25zdCB0b3RhbFJvb21zID0gcHJvY2Vzc2VkUm9vbXMubGVuZ3RoXG4gICAgY29uc3Qgb2NjdXBpZWRSb29tcyA9IHByb2Nlc3NlZFJvb21zLmZpbHRlcihyID0+IHIuZGlzcGxheVN0YXR1cyA9PT0gJ09DQ1VQSUVEJykubGVuZ3RoXG4gICAgY29uc3Qgb2NjdXBhbmN5UmF0ZSA9IHRvdGFsUm9vbXMgPiAwID8gKG9jY3VwaWVkUm9vbXMgLyB0b3RhbFJvb21zKSAqIDEwMCA6IDBcblxuICAgIC8vIEJvb2tpbmdzIGNyZWF0ZWQgVE9EQVkgKG5vdCBmb3IgdGFyZ2V0RGF0ZSwgYnV0IHBoeXNpY2FsIGNyZWF0aW9uKVxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKVxuICAgIHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApXG4gICAgY29uc3QgYm9va2luZ3NDcmVhdGVkVG9kYXkgPSBhd2FpdCBwcmlzbWEuYm9va2luZy5maW5kTWFueSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBjcmVhdGVkQXQ6IHsgZ3RlOiB0b2RheSB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHJldmVudWVUb2RheSA9IGJvb2tpbmdzQ3JlYXRlZFRvZGF5LnJlZHVjZSgoYWNjOiBudW1iZXIsIGJvb2tpbmc6IGFueSkgPT4gYWNjICsgYm9va2luZy50b3RhbEFtb3VudCwgMClcblxuICAgIGNvbnN0IHBlbmRpbmdSZXNlcnZhdGlvbnMgPSBhd2FpdCBwcmlzbWEuYm9va2luZy5jb3VudCh7XG4gICAgICB3aGVyZTogeyBzdGF0dXM6ICdQRU5ESU5HJyB9XG4gICAgfSlcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzdGF0czoge1xuICAgICAgICBvY2N1cGFuY3lSYXRlLFxuICAgICAgICByZXZlbnVlVG9kYXksXG4gICAgICAgIHBlbmRpbmdSZXNlcnZhdGlvbnNcbiAgICAgIH0sXG4gICAgICByb29tczogcHJvY2Vzc2VkUm9vbXNcbiAgICB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggZGFzaGJvYXJkIGRhdGEnIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJkYXRlU3RyIiwiZ2V0IiwidGFyZ2V0RGF0ZSIsIkRhdGUiLCJzZXRIb3VycyIsIm5leHREYXkiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInJvb21zIiwicm9vbSIsImZpbmRNYW55Iiwib3JkZXJCeSIsIm51bWJlciIsImluY2x1ZGUiLCJmbG9vciIsImJvb2tpbmdzIiwid2hlcmUiLCJzdGF0dXMiLCJpbiIsIkFORCIsImNoZWNrSW4iLCJsdCIsImNoZWNrT3V0IiwiZ3QiLCJndWVzdCIsInByb2Nlc3NlZFJvb21zIiwibWFwIiwiYWN0aXZlQm9va2luZyIsImRpc3BsYXlTdGF0dXMiLCJ0b3RhbFJvb21zIiwibGVuZ3RoIiwib2NjdXBpZWRSb29tcyIsImZpbHRlciIsInIiLCJvY2N1cGFuY3lSYXRlIiwidG9kYXkiLCJib29raW5nc0NyZWF0ZWRUb2RheSIsImJvb2tpbmciLCJjcmVhdGVkQXQiLCJndGUiLCJyZXZlbnVlVG9kYXkiLCJyZWR1Y2UiLCJhY2MiLCJ0b3RhbEFtb3VudCIsInBlbmRpbmdSZXNlcnZhdGlvbnMiLCJjb3VudCIsImpzb24iLCJzdGF0cyIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/dashboard/route.ts\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Froute&page=%2Fapi%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();