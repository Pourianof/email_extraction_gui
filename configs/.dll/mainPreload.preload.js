(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/events.ts":
/*!*******************************!*\
  !*** ./src/backend/events.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Events: () => (/* binding */ Events)
/* harmony export */ });
class Events {
}
Events.EXTRACT_URLS = 'extracturls';
Events.EXTRACT_PROGRESS = 'extractprogression';
Events.EXTRACT_END = 'extractend';
Events.OPEN_EXCEL = 'openexcel';
Events.GET_EXTRACTED = 'getextracted';
Events.OPEN_LINK = 'openlink';
Events.WIN_ACTIONS = 'winaction';


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/backend/preload.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contextApi: () => (/* binding */ contextApi)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/backend/events.ts");


let scheduledForRemovingListeners = false;
function removeProgressListeners() {
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeAllListeners(_events__WEBPACK_IMPORTED_MODULE_1__.Events.EXTRACT_PROGRESS);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeAllListeners(_events__WEBPACK_IMPORTED_MODULE_1__.Events.EXTRACT_END);
    scheduledForRemovingListeners = false;
}
const contextApi = {
    async extractURLs(urls) {
        const result = await electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_events__WEBPACK_IMPORTED_MODULE_1__.Events.EXTRACT_URLS, JSON.stringify(urls));
        removeProgressListeners();
        return result;
    },
    listenToExtractionProgress: function (cb) {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.addListener(_events__WEBPACK_IMPORTED_MODULE_1__.Events.EXTRACT_PROGRESS, (_, data) => {
            const state = JSON.parse(data);
            cb(state);
        });
        if (!scheduledForRemovingListeners) {
            this.listenToExtractionEnd();
            scheduledForRemovingListeners = true;
        }
    },
    listenToExtractionEnd: function (cb) {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.addListener(_events__WEBPACK_IMPORTED_MODULE_1__.Events.EXTRACT_END, () => {
            cb?.();
            removeProgressListeners();
        });
    },
    openExcelFile: function (filePath) {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(_events__WEBPACK_IMPORTED_MODULE_1__.Events.OPEN_EXCEL, filePath);
    },
    getExtractedItems: async function () {
        const result = JSON.parse(await electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_events__WEBPACK_IMPORTED_MODULE_1__.Events.GET_EXTRACTED));
        if (result.status && result.code < 0) {
            throw new Error(result.status.message);
        }
        return result.data;
    },
    openLink: function (linkName) {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(_events__WEBPACK_IMPORTED_MODULE_1__.Events.OPEN_LINK, linkName);
    },
    operateWindowActions: function (action) {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(_events__WEBPACK_IMPORTED_MODULE_1__.Events.WIN_ACTIONS, action);
    },
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('context', contextApi);

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUMsQ0FBQztRQUMxRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBQ0QsUUFBUSxFQUFFLFVBQVUsUUFBZ0I7UUFDbEMsaURBQVcsQ0FBQyxJQUFJLENBQUMsMkNBQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNELG9CQUFvQixFQUFFLFVBQVUsTUFBK0I7UUFDN0QsaURBQVcsQ0FBQyxJQUFJLENBQUMsMkNBQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNGLENBQUM7QUFFRixtREFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3Ivd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3IvLi9zcmMvYmFja2VuZC9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9hdXNtdC1hdXRob3ItY29sbGVjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3Ivd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3Ivd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hdXNtdC1hdXRob3ItY29sbGVjdG9yLy4vc3JjL2JhY2tlbmQvcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwiZXhwb3J0IGNsYXNzIEV2ZW50cyB7XHJcbiAgc3RhdGljIHJlYWRvbmx5IEVYVFJBQ1RfVVJMUyA9ICdleHRyYWN0dXJscyc7XHJcbiAgc3RhdGljIHJlYWRvbmx5IEVYVFJBQ1RfUFJPR1JFU1MgPSAnZXh0cmFjdHByb2dyZXNzaW9uJztcclxuICBzdGF0aWMgcmVhZG9ubHkgRVhUUkFDVF9FTkQgPSAnZXh0cmFjdGVuZCc7XHJcbiAgc3RhdGljIHJlYWRvbmx5IE9QRU5fRVhDRUwgPSAnb3BlbmV4Y2VsJztcclxuICBzdGF0aWMgcmVhZG9ubHkgR0VUX0VYVFJBQ1RFRCA9ICdnZXRleHRyYWN0ZWQnO1xyXG4gIHN0YXRpYyByZWFkb25seSBPUEVOX0xJTksgPSAnb3BlbmxpbmsnO1xyXG4gIHN0YXRpYyByZWFkb25seSBXSU5fQUNUSU9OUyA9ICd3aW5hY3Rpb24nO1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcclxuXHJcbmltcG9ydCBDb250ZXh0QXBpIGZyb20gJy4uL3NoYXJlZC9jb250ZXh0QXBpJztcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xyXG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL3NoYXJlZC9tb2RlbHMvYXV0aG9yJztcclxuXHJcbmxldCBzY2hlZHVsZWRGb3JSZW1vdmluZ0xpc3RlbmVycyA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gcmVtb3ZlUHJvZ3Jlc3NMaXN0ZW5lcnMoKSB7XHJcbiAgaXBjUmVuZGVyZXIucmVtb3ZlQWxsTGlzdGVuZXJzKEV2ZW50cy5FWFRSQUNUX1BST0dSRVNTKTtcclxuICBpcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoRXZlbnRzLkVYVFJBQ1RfRU5EKTtcclxuICBzY2hlZHVsZWRGb3JSZW1vdmluZ0xpc3RlbmVycyA9IGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY29udGV4dEFwaTogQ29udGV4dEFwaSA9IHtcclxuICBhc3luYyBleHRyYWN0VVJMcyh1cmxzKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoXHJcbiAgICAgIEV2ZW50cy5FWFRSQUNUX1VSTFMsXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHVybHMpXHJcbiAgICApO1xyXG4gICAgcmVtb3ZlUHJvZ3Jlc3NMaXN0ZW5lcnMoKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxuICBsaXN0ZW5Ub0V4dHJhY3Rpb25Qcm9ncmVzczogZnVuY3Rpb24gKFxyXG4gICAgY2I6IChzdGF0ZTogeyBhdXRob3I6IEF1dGhvcjsgdG90YWxBdXRob3JSZWNpZXZlZDogbnVtYmVyIH0pID0+IGFueVxyXG4gICk6IHZvaWQge1xyXG4gICAgaXBjUmVuZGVyZXIuYWRkTGlzdGVuZXIoRXZlbnRzLkVYVFJBQ1RfUFJPR1JFU1MsIChfLCBkYXRhKSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgY2Ioc3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoIXNjaGVkdWxlZEZvclJlbW92aW5nTGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuVG9FeHRyYWN0aW9uRW5kKCk7XHJcbiAgICAgIHNjaGVkdWxlZEZvclJlbW92aW5nTGlzdGVuZXJzID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBsaXN0ZW5Ub0V4dHJhY3Rpb25FbmQ6IGZ1bmN0aW9uIChjYj86ICgpID0+IGFueSk6IHZvaWQge1xyXG4gICAgaXBjUmVuZGVyZXIuYWRkTGlzdGVuZXIoRXZlbnRzLkVYVFJBQ1RfRU5ELCAoKSA9PiB7XHJcbiAgICAgIGNiPy4oKTtcclxuICAgICAgcmVtb3ZlUHJvZ3Jlc3NMaXN0ZW5lcnMoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgb3BlbkV4Y2VsRmlsZTogZnVuY3Rpb24gKGZpbGVQYXRoOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlwY1JlbmRlcmVyLnNlbmQoRXZlbnRzLk9QRU5fRVhDRUwsIGZpbGVQYXRoKTtcclxuICB9LFxyXG4gIGdldEV4dHJhY3RlZEl0ZW1zOiBhc3luYyBmdW5jdGlvbiAoKTogUHJvbWlzZTxcclxuICAgIHsgZmlsZVBhdGg6IHN0cmluZzsgZGF0ZTogbnVtYmVyIH1bXVxyXG4gID4ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoRXZlbnRzLkdFVF9FWFRSQUNURUQpKTtcclxuICAgIGlmIChyZXN1bHQuc3RhdHVzICYmIHJlc3VsdC5jb2RlIDwgMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnN0YXR1cy5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LmRhdGE7XHJcbiAgfSxcclxuICBvcGVuTGluazogZnVuY3Rpb24gKGxpbmtOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlwY1JlbmRlcmVyLnNlbmQoRXZlbnRzLk9QRU5fTElOSywgbGlua05hbWUpO1xyXG4gIH0sXHJcbiAgb3BlcmF0ZVdpbmRvd0FjdGlvbnM6IGZ1bmN0aW9uIChhY3Rpb246ICdjbG9zZScgfCAnbWF4JyB8ICdtaW4nKTogdm9pZCB7XHJcbiAgICBpcGNSZW5kZXJlci5zZW5kKEV2ZW50cy5XSU5fQUNUSU9OUywgYWN0aW9uKTtcclxuICB9LFxyXG59O1xyXG5cclxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnY29udGV4dCcsIGNvbnRleHRBcGkpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=