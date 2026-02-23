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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\nfunction cacheHeaders(maxAge = 30, swr = 60) {\n    return {\n        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}`\n    };\n}\nasync function GET(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const dateStr = searchParams.get('date');\n        const targetDate = dateStr ? new Date(dateStr) : new Date();\n        targetDate.setHours(0, 0, 0, 0);\n        const nextDay = new Date(targetDate);\n        nextDay.setDate(targetDate.getDate() + 1);\n        // Run all queries in parallel\n        const [rooms, revenueAgg, pendingCount] = await Promise.all([\n            // Room grid with active bookings for the target date\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.room.findMany({\n                orderBy: {\n                    number: 'asc'\n                },\n                include: {\n                    floor: true,\n                    bookings: {\n                        where: {\n                            status: {\n                                in: [\n                                    'CONFIRMED',\n                                    'CHECKED_IN'\n                                ]\n                            },\n                            checkIn: {\n                                lt: nextDay\n                            },\n                            checkOut: {\n                                gt: targetDate\n                            }\n                        },\n                        include: {\n                            guest: {\n                                select: {\n                                    name: true\n                                }\n                            }\n                        },\n                        take: 1\n                    }\n                }\n            }),\n            // Aggregate revenue created today — no full row fetch\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.aggregate({\n                _sum: {\n                    totalAmount: true\n                },\n                where: {\n                    createdAt: {\n                        gte: new Date(new Date().setHours(0, 0, 0, 0))\n                    }\n                }\n            }),\n            // Pending reservations count\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.count({\n                where: {\n                    status: 'PENDING'\n                }\n            })\n        ]);\n        // Compute display status\n        const processedRooms = rooms.map((room)=>{\n            const activeBooking = room.bookings[0] ?? null;\n            return {\n                ...room,\n                displayStatus: activeBooking ? 'OCCUPIED' : 'AVAILABLE',\n                activeBooking\n            };\n        });\n        const totalRooms = processedRooms.length;\n        const occupiedRooms = processedRooms.filter((r)=>r.displayStatus === 'OCCUPIED').length;\n        const occupancyRate = totalRooms > 0 ? occupiedRooms / totalRooms * 100 : 0;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            stats: {\n                occupancyRate,\n                revenueToday: revenueAgg._sum.totalAmount ?? 0,\n                pendingReservations: pendingCount\n            },\n            rooms: processedRooms\n        }, {\n            headers: cacheHeaders(30, 60)\n        });\n    } catch (error) {\n        console.error(error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch dashboard data'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEdBQUc7WUFBRWhDLFFBQVE7UUFBSTtJQUN0RjtBQUNGIiwic291cmNlcyI6WyJEOlxcTW9uZXlcXENhc2FcXGNobXNcXHNyY1xcYXBwXFxhcGlcXGRhc2hib2FyZFxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9kYidcblxuZnVuY3Rpb24gY2FjaGVIZWFkZXJzKG1heEFnZSA9IDMwLCBzd3IgPSA2MCkge1xuICByZXR1cm4geyAnQ2FjaGUtQ29udHJvbCc6IGBwdWJsaWMsIHMtbWF4YWdlPSR7bWF4QWdlfSwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0ke3N3cn1gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKVxuICAgIGNvbnN0IGRhdGVTdHIgPSBzZWFyY2hQYXJhbXMuZ2V0KCdkYXRlJylcbiAgICBjb25zdCB0YXJnZXREYXRlID0gZGF0ZVN0ciA/IG5ldyBEYXRlKGRhdGVTdHIpIDogbmV3IERhdGUoKVxuICAgIHRhcmdldERhdGUuc2V0SG91cnMoMCwgMCwgMCwgMClcblxuICAgIGNvbnN0IG5leHREYXkgPSBuZXcgRGF0ZSh0YXJnZXREYXRlKVxuICAgIG5leHREYXkuc2V0RGF0ZSh0YXJnZXREYXRlLmdldERhdGUoKSArIDEpXG5cbiAgICAvLyBSdW4gYWxsIHF1ZXJpZXMgaW4gcGFyYWxsZWxcbiAgICBjb25zdCBbcm9vbXMsIHJldmVudWVBZ2csIHBlbmRpbmdDb3VudF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAvLyBSb29tIGdyaWQgd2l0aCBhY3RpdmUgYm9va2luZ3MgZm9yIHRoZSB0YXJnZXQgZGF0ZVxuICAgICAgcHJpc21hLnJvb20uZmluZE1hbnkoe1xuICAgICAgICBvcmRlckJ5OiB7IG51bWJlcjogJ2FzYycgfSxcbiAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgIGZsb29yOiB0cnVlLFxuICAgICAgICAgIGJvb2tpbmdzOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBzdGF0dXM6IHsgaW46IFsnQ09ORklSTUVEJywgJ0NIRUNLRURfSU4nXSB9LFxuICAgICAgICAgICAgICBjaGVja0luOiB7IGx0OiBuZXh0RGF5IH0sXG4gICAgICAgICAgICAgIGNoZWNrT3V0OiB7IGd0OiB0YXJnZXREYXRlIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5jbHVkZTogeyBndWVzdDogeyBzZWxlY3Q6IHsgbmFtZTogdHJ1ZSB9IH0gfSxcbiAgICAgICAgICAgIHRha2U6IDEsIC8vIG9ubHkgbmVlZCB0aGUgZmlyc3QgYWN0aXZlIGJvb2tpbmcgcGVyIHJvb21cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG5cbiAgICAgIC8vIEFnZ3JlZ2F0ZSByZXZlbnVlIGNyZWF0ZWQgdG9kYXkg4oCUIG5vIGZ1bGwgcm93IGZldGNoXG4gICAgICBwcmlzbWEuYm9va2luZy5hZ2dyZWdhdGUoe1xuICAgICAgICBfc3VtOiB7IHRvdGFsQW1vdW50OiB0cnVlIH0sXG4gICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgY3JlYXRlZEF0OiB7XG4gICAgICAgICAgICBndGU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuc2V0SG91cnMoMCwgMCwgMCwgMCkpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcblxuICAgICAgLy8gUGVuZGluZyByZXNlcnZhdGlvbnMgY291bnRcbiAgICAgIHByaXNtYS5ib29raW5nLmNvdW50KHsgd2hlcmU6IHsgc3RhdHVzOiAnUEVORElORycgfSB9KSxcbiAgICBdKVxuXG4gICAgLy8gQ29tcHV0ZSBkaXNwbGF5IHN0YXR1c1xuICAgIGNvbnN0IHByb2Nlc3NlZFJvb21zID0gcm9vbXMubWFwKHJvb20gPT4ge1xuICAgICAgY29uc3QgYWN0aXZlQm9va2luZyA9IHJvb20uYm9va2luZ3NbMF0gPz8gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnJvb20sXG4gICAgICAgIGRpc3BsYXlTdGF0dXM6IGFjdGl2ZUJvb2tpbmcgPyAnT0NDVVBJRUQnIDogJ0FWQUlMQUJMRScsXG4gICAgICAgIGFjdGl2ZUJvb2tpbmcsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxSb29tcyA9IHByb2Nlc3NlZFJvb21zLmxlbmd0aDtcbiAgICBjb25zdCBvY2N1cGllZFJvb21zID0gcHJvY2Vzc2VkUm9vbXMuZmlsdGVyKHIgPT4gci5kaXNwbGF5U3RhdHVzID09PSAnT0NDVVBJRUQnKS5sZW5ndGg7XG4gICAgY29uc3Qgb2NjdXBhbmN5UmF0ZSA9IHRvdGFsUm9vbXMgPiAwID8gKG9jY3VwaWVkUm9vbXMgLyB0b3RhbFJvb21zKSAqIDEwMCA6IDA7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7XG4gICAgICAgIHN0YXRzOiB7XG4gICAgICAgICAgb2NjdXBhbmN5UmF0ZSxcbiAgICAgICAgICByZXZlbnVlVG9kYXk6IHJldmVudWVBZ2cuX3N1bS50b3RhbEFtb3VudCA/PyAwLFxuICAgICAgICAgIHBlbmRpbmdSZXNlcnZhdGlvbnM6IHBlbmRpbmdDb3VudCxcbiAgICAgICAgfSxcbiAgICAgICAgcm9vbXM6IHByb2Nlc3NlZFJvb21zLFxuICAgICAgfSxcbiAgICAgIHsgaGVhZGVyczogY2FjaGVIZWFkZXJzKDMwLCA2MCkgfVxuICAgIClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIGRhc2hib2FyZCBkYXRhJyB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJjYWNoZUhlYWRlcnMiLCJtYXhBZ2UiLCJzd3IiLCJHRVQiLCJyZXF1ZXN0Iiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwiZGF0ZVN0ciIsImdldCIsInRhcmdldERhdGUiLCJEYXRlIiwic2V0SG91cnMiLCJuZXh0RGF5Iiwic2V0RGF0ZSIsImdldERhdGUiLCJyb29tcyIsInJldmVudWVBZ2ciLCJwZW5kaW5nQ291bnQiLCJQcm9taXNlIiwiYWxsIiwicm9vbSIsImZpbmRNYW55Iiwib3JkZXJCeSIsIm51bWJlciIsImluY2x1ZGUiLCJmbG9vciIsImJvb2tpbmdzIiwid2hlcmUiLCJzdGF0dXMiLCJpbiIsImNoZWNrSW4iLCJsdCIsImNoZWNrT3V0IiwiZ3QiLCJndWVzdCIsInNlbGVjdCIsIm5hbWUiLCJ0YWtlIiwiYm9va2luZyIsImFnZ3JlZ2F0ZSIsIl9zdW0iLCJ0b3RhbEFtb3VudCIsImNyZWF0ZWRBdCIsImd0ZSIsImNvdW50IiwicHJvY2Vzc2VkUm9vbXMiLCJtYXAiLCJhY3RpdmVCb29raW5nIiwiZGlzcGxheVN0YXR1cyIsInRvdGFsUm9vbXMiLCJsZW5ndGgiLCJvY2N1cGllZFJvb21zIiwiZmlsdGVyIiwiciIsIm9jY3VwYW5jeVJhdGUiLCJqc29uIiwic3RhdHMiLCJyZXZlbnVlVG9kYXkiLCJwZW5kaW5nUmVzZXJ2YXRpb25zIiwiaGVhZGVycyIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/dashboard/route.ts\n");

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