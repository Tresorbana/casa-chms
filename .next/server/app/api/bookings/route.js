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
exports.id = "app/api/bookings/route";
exports.ids = ["app/api/bookings/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fbookings%2Froute&page=%2Fapi%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fbookings%2Froute&page=%2Fapi%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Money_Casa_chms_src_app_api_bookings_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/bookings/route.ts */ \"(rsc)/./src/app/api/bookings/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/bookings/route\",\n        pathname: \"/api/bookings\",\n        filename: \"route\",\n        bundlePath: \"app/api/bookings/route\"\n    },\n    resolvedPagePath: \"D:\\\\Money\\\\Casa\\\\chms\\\\src\\\\app\\\\api\\\\bookings\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Money_Casa_chms_src_app_api_bookings_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZib29raW5ncyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYm9va2luZ3MlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZib29raW5ncyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDTW9uZXklNUNDYXNhJTVDY2htcyU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q01vbmV5JTVDQ2FzYSU1Q2NobXMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ1E7QUFDckY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXE1vbmV5XFxcXENhc2FcXFxcY2htc1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxib29raW5nc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYm9va2luZ3Mvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ib29raW5nc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYm9va2luZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxNb25leVxcXFxDYXNhXFxcXGNobXNcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYm9va2luZ3NcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fbookings%2Froute&page=%2Fapi%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/bookings/route.ts":
/*!***************************************!*\
  !*** ./src/app/api/bookings/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\nasync function GET() {\n    try {\n        const bookings = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.findMany({\n            include: {\n                guest: true,\n                room: true\n            },\n            orderBy: {\n                createdAt: 'desc'\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(bookings);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch bookings'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { guestName, guestEmail, guestPhone, roomNumber, checkIn, checkOut, totalAmount, nationality } = body;\n        // Find or create guest\n        let guest = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.guest.findFirst({\n            where: {\n                email: guestEmail\n            }\n        });\n        if (!guest) {\n            guest = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.guest.create({\n                data: {\n                    name: guestName,\n                    email: guestEmail,\n                    phone: guestPhone,\n                    nationality: nationality\n                }\n            });\n        } else if (nationality && !guest.nationality) {\n            // Update nationality if missing\n            guest = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.guest.update({\n                where: {\n                    id: guest.id\n                },\n                data: {\n                    nationality\n                }\n            });\n        }\n        const room = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.room.findUnique({\n            where: {\n                number: roomNumber\n            }\n        });\n        if (!room) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Room not found'\n            }, {\n                status: 404\n            });\n        }\n        const booking = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.booking.create({\n            data: {\n                guestId: guest.id,\n                roomId: room.id,\n                checkIn: new Date(checkIn),\n                checkOut: new Date(checkOut),\n                totalAmount: parseFloat(totalAmount),\n                status: 'CONFIRMED'\n            }\n        });\n        // Update room status to OCCUPIED if the booking is for now/today\n        const now = new Date();\n        const start = new Date(checkIn);\n        const end = new Date(checkOut);\n        if (start <= now && end >= now) {\n            await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.room.update({\n                where: {\n                    id: room.id\n                },\n                data: {\n                    status: 'OCCUPIED'\n                }\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(booking);\n    } catch (error) {\n        console.error(error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to create booking'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBMkIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDaEY7QUFDRiIsInNvdXJjZXMiOlsiRDpcXE1vbmV5XFxDYXNhXFxjaG1zXFxzcmNcXGFwcFxcYXBpXFxib29raW5nc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9kYidcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib29raW5ncyA9IGF3YWl0IHByaXNtYS5ib29raW5nLmZpbmRNYW55KHtcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgZ3Vlc3Q6IHRydWUsXG4gICAgICAgIHJvb206IHRydWVcbiAgICAgIH0sXG4gICAgICBvcmRlckJ5OiB7XG4gICAgICAgIGNyZWF0ZWRBdDogJ2Rlc2MnXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYm9va2luZ3MpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggYm9va2luZ3MnIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXG4gICAgY29uc3QgeyBndWVzdE5hbWUsIGd1ZXN0RW1haWwsIGd1ZXN0UGhvbmUsIHJvb21OdW1iZXIsIGNoZWNrSW4sIGNoZWNrT3V0LCB0b3RhbEFtb3VudCwgbmF0aW9uYWxpdHkgfSA9IGJvZHlcblxuICAgIC8vIEZpbmQgb3IgY3JlYXRlIGd1ZXN0XG4gICAgbGV0IGd1ZXN0ID0gYXdhaXQgcHJpc21hLmd1ZXN0LmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogeyBlbWFpbDogZ3Vlc3RFbWFpbCB9XG4gICAgfSlcblxuICAgIGlmICghZ3Vlc3QpIHtcbiAgICAgIGd1ZXN0ID0gYXdhaXQgcHJpc21hLmd1ZXN0LmNyZWF0ZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBuYW1lOiBndWVzdE5hbWUsXG4gICAgICAgICAgZW1haWw6IGd1ZXN0RW1haWwsXG4gICAgICAgICAgcGhvbmU6IGd1ZXN0UGhvbmUsXG4gICAgICAgICAgbmF0aW9uYWxpdHk6IG5hdGlvbmFsaXR5XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChuYXRpb25hbGl0eSAmJiAhZ3Vlc3QubmF0aW9uYWxpdHkpIHtcbiAgICAgIC8vIFVwZGF0ZSBuYXRpb25hbGl0eSBpZiBtaXNzaW5nXG4gICAgICBndWVzdCA9IGF3YWl0IHByaXNtYS5ndWVzdC51cGRhdGUoe1xuICAgICAgICB3aGVyZTogeyBpZDogZ3Vlc3QuaWQgfSxcbiAgICAgICAgZGF0YTogeyBuYXRpb25hbGl0eSB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHJvb20gPSBhd2FpdCBwcmlzbWEucm9vbS5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IG51bWJlcjogcm9vbU51bWJlciB9XG4gICAgfSlcblxuICAgIGlmICghcm9vbSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdSb29tIG5vdCBmb3VuZCcgfSwgeyBzdGF0dXM6IDQwNCB9KVxuICAgIH1cblxuICAgIGNvbnN0IGJvb2tpbmcgPSBhd2FpdCBwcmlzbWEuYm9va2luZy5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBndWVzdElkOiBndWVzdC5pZCxcbiAgICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgICAgICBjaGVja0luOiBuZXcgRGF0ZShjaGVja0luKSxcbiAgICAgICAgY2hlY2tPdXQ6IG5ldyBEYXRlKGNoZWNrT3V0KSxcbiAgICAgICAgdG90YWxBbW91bnQ6IHBhcnNlRmxvYXQodG90YWxBbW91bnQpLFxuICAgICAgICBzdGF0dXM6ICdDT05GSVJNRUQnXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFVwZGF0ZSByb29tIHN0YXR1cyB0byBPQ0NVUElFRCBpZiB0aGUgYm9va2luZyBpcyBmb3Igbm93L3RvZGF5XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoY2hlY2tJbilcbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShjaGVja091dClcblxuICAgIGlmIChzdGFydCA8PSBub3cgJiYgZW5kID49IG5vdykge1xuICAgICAgYXdhaXQgcHJpc21hLnJvb20udXBkYXRlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQ6IHJvb20uaWQgfSxcbiAgICAgICAgZGF0YTogeyBzdGF0dXM6ICdPQ0NVUElFRCcgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYm9va2luZylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGNyZWF0ZSBib29raW5nJyB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJHRVQiLCJib29raW5ncyIsImJvb2tpbmciLCJmaW5kTWFueSIsImluY2x1ZGUiLCJndWVzdCIsInJvb20iLCJvcmRlckJ5IiwiY3JlYXRlZEF0IiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiUE9TVCIsInJlcXVlc3QiLCJib2R5IiwiZ3Vlc3ROYW1lIiwiZ3Vlc3RFbWFpbCIsImd1ZXN0UGhvbmUiLCJyb29tTnVtYmVyIiwiY2hlY2tJbiIsImNoZWNrT3V0IiwidG90YWxBbW91bnQiLCJuYXRpb25hbGl0eSIsImZpbmRGaXJzdCIsIndoZXJlIiwiZW1haWwiLCJjcmVhdGUiLCJkYXRhIiwibmFtZSIsInBob25lIiwidXBkYXRlIiwiaWQiLCJmaW5kVW5pcXVlIiwibnVtYmVyIiwiZ3Vlc3RJZCIsInJvb21JZCIsIkRhdGUiLCJwYXJzZUZsb2F0Iiwibm93Iiwic3RhcnQiLCJlbmQiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/bookings/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fbookings%2Froute&page=%2Fapi%2Fbookings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbookings%2Froute.ts&appDir=D%3A%5CMoney%5CCasa%5Cchms%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMoney%5CCasa%5Cchms&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();