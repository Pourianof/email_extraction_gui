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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
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

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpblByZWxvYWQucHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7QUNWTyxNQUFNLE1BQU07O0FBQ0QsbUJBQVksR0FBRyxhQUFhLENBQUM7QUFDN0IsdUJBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUFDeEMsa0JBQVcsR0FBRyxZQUFZLENBQUM7QUFDM0IsaUJBQVUsR0FBRyxXQUFXLENBQUM7QUFDekIsb0JBQWEsR0FBRyxjQUFjLENBQUM7QUFDL0IsZ0JBQVMsR0FBRyxVQUFVLENBQUM7QUFDdkIsa0JBQVcsR0FBRyxXQUFXLENBQUM7Ozs7Ozs7Ozs7O0FDUDVDOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOc0Q7QUFHcEI7QUFHbEMsSUFBSSw2QkFBNkIsR0FBRyxLQUFLLENBQUM7QUFFMUMsU0FBUyx1QkFBdUI7SUFDOUIsaURBQVcsQ0FBQyxrQkFBa0IsQ0FBQywyQ0FBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeEQsaURBQVcsQ0FBQyxrQkFBa0IsQ0FBQywyQ0FBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25ELDZCQUE2QixHQUFHLEtBQUssQ0FBQztBQUN4QyxDQUFDO0FBRU0sTUFBTSxVQUFVLEdBQWU7SUFDcEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLE1BQU0saURBQVcsQ0FBQyxNQUFNLENBQ3JDLDJDQUFNLENBQUMsWUFBWSxFQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUNyQixDQUFDO1FBQ0YsdUJBQXVCLEVBQUUsQ0FBQztRQUMxQixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsMEJBQTBCLEVBQUUsVUFDMUIsRUFBbUU7UUFFbkUsaURBQVcsQ0FBQyxXQUFXLENBQUMsMkNBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDN0IsNkJBQTZCLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLENBQUM7SUFDSCxDQUFDO0lBRUQscUJBQXFCLEVBQUUsVUFBVSxFQUFjO1FBQzdDLGlEQUFXLENBQUMsV0FBVyxDQUFDLDJDQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1AsdUJBQXVCLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxhQUFhLEVBQUUsVUFBVSxRQUFnQjtRQUN2QyxpREFBVyxDQUFDLElBQUksQ0FBQywyQ0FBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsaUJBQWlCLEVBQUUsS0FBSztRQUd0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0saURBQVcsQ0FBQyxNQUFNLENBQUMsMkNBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxRQUFRLEVBQUUsVUFBVSxRQUFnQjtRQUNsQyxpREFBVyxDQUFDLElBQUksQ0FBQywyQ0FBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0Qsb0JBQW9CLEVBQUUsVUFBVSxNQUErQjtRQUM3RCxpREFBVyxDQUFDLElBQUksQ0FBQywyQ0FBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0YsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci8uL3NyYy9iYWNrZW5kL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9hdXNtdC1hdXRob3ItY29sbGVjdG9yL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3Ivd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9hdXNtdC1hdXRob3ItY29sbGVjdG9yL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hdXNtdC1hdXRob3ItY29sbGVjdG9yL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXVzbXQtYXV0aG9yLWNvbGxlY3Rvci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2F1c210LWF1dGhvci1jb2xsZWN0b3IvLi9zcmMvYmFja2VuZC9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJleHBvcnQgY2xhc3MgRXZlbnRzIHtcclxuICBzdGF0aWMgcmVhZG9ubHkgRVhUUkFDVF9VUkxTID0gJ2V4dHJhY3R1cmxzJztcclxuICBzdGF0aWMgcmVhZG9ubHkgRVhUUkFDVF9QUk9HUkVTUyA9ICdleHRyYWN0cHJvZ3Jlc3Npb24nO1xyXG4gIHN0YXRpYyByZWFkb25seSBFWFRSQUNUX0VORCA9ICdleHRyYWN0ZW5kJztcclxuICBzdGF0aWMgcmVhZG9ubHkgT1BFTl9FWENFTCA9ICdvcGVuZXhjZWwnO1xyXG4gIHN0YXRpYyByZWFkb25seSBHRVRfRVhUUkFDVEVEID0gJ2dldGV4dHJhY3RlZCc7XHJcbiAgc3RhdGljIHJlYWRvbmx5IE9QRU5fTElOSyA9ICdvcGVubGluayc7XHJcbiAgc3RhdGljIHJlYWRvbmx5IFdJTl9BQ1RJT05TID0gJ3dpbmFjdGlvbic7XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxuaW1wb3J0IENvbnRleHRBcGkgZnJvbSAnLi4vc2hhcmVkL2NvbnRleHRBcGknO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICcuL2V2ZW50cyc7XHJcbmltcG9ydCBBdXRob3IgZnJvbSAnLi4vc2hhcmVkL21vZGVscy9hdXRob3InO1xyXG5cclxubGV0IHNjaGVkdWxlZEZvclJlbW92aW5nTGlzdGVuZXJzID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiByZW1vdmVQcm9ncmVzc0xpc3RlbmVycygpIHtcclxuICBpcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoRXZlbnRzLkVYVFJBQ1RfUFJPR1JFU1MpO1xyXG4gIGlwY1JlbmRlcmVyLnJlbW92ZUFsbExpc3RlbmVycyhFdmVudHMuRVhUUkFDVF9FTkQpO1xyXG4gIHNjaGVkdWxlZEZvclJlbW92aW5nTGlzdGVuZXJzID0gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb250ZXh0QXBpOiBDb250ZXh0QXBpID0ge1xyXG4gIGFzeW5jIGV4dHJhY3RVUkxzKHVybHMpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGlwY1JlbmRlcmVyLmludm9rZShcclxuICAgICAgRXZlbnRzLkVYVFJBQ1RfVVJMUyxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkodXJscylcclxuICAgICk7XHJcbiAgICByZW1vdmVQcm9ncmVzc0xpc3RlbmVycygpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG4gIGxpc3RlblRvRXh0cmFjdGlvblByb2dyZXNzOiBmdW5jdGlvbiAoXHJcbiAgICBjYjogKHN0YXRlOiB7IGF1dGhvcjogQXV0aG9yOyB0b3RhbEF1dGhvclJlY2lldmVkOiBudW1iZXIgfSkgPT4gYW55XHJcbiAgKTogdm9pZCB7XHJcbiAgICBpcGNSZW5kZXJlci5hZGRMaXN0ZW5lcihFdmVudHMuRVhUUkFDVF9QUk9HUkVTUywgKF8sIGRhdGEpID0+IHtcclxuICAgICAgY29uc3Qgc3RhdGUgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICBjYihzdGF0ZSk7XHJcbiAgICB9KTtcclxuICAgIGlmICghc2NoZWR1bGVkRm9yUmVtb3ZpbmdMaXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5saXN0ZW5Ub0V4dHJhY3Rpb25FbmQoKTtcclxuICAgICAgc2NoZWR1bGVkRm9yUmVtb3ZpbmdMaXN0ZW5lcnMgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGxpc3RlblRvRXh0cmFjdGlvbkVuZDogZnVuY3Rpb24gKGNiPzogKCkgPT4gYW55KTogdm9pZCB7XHJcbiAgICBpcGNSZW5kZXJlci5hZGRMaXN0ZW5lcihFdmVudHMuRVhUUkFDVF9FTkQsICgpID0+IHtcclxuICAgICAgY2I/LigpO1xyXG4gICAgICByZW1vdmVQcm9ncmVzc0xpc3RlbmVycygpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvcGVuRXhjZWxGaWxlOiBmdW5jdGlvbiAoZmlsZVBhdGg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgaXBjUmVuZGVyZXIuc2VuZChFdmVudHMuT1BFTl9FWENFTCwgZmlsZVBhdGgpO1xyXG4gIH0sXHJcbiAgZ2V0RXh0cmFjdGVkSXRlbXM6IGFzeW5jIGZ1bmN0aW9uICgpOiBQcm9taXNlPFxyXG4gICAgeyBmaWxlUGF0aDogc3RyaW5nOyBkYXRlOiBudW1iZXIgfVtdXHJcbiAgPiB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBKU09OLnBhcnNlKGF3YWl0IGlwY1JlbmRlcmVyLmludm9rZShFdmVudHMuR0VUX0VYVFJBQ1RFRCkpO1xyXG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgJiYgcmVzdWx0LmNvZGUgPCAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuc3RhdHVzLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQuZGF0YTtcclxuICB9LFxyXG4gIG9wZW5MaW5rOiBmdW5jdGlvbiAobGlua05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgaXBjUmVuZGVyZXIuc2VuZChFdmVudHMuT1BFTl9MSU5LLCBsaW5rTmFtZSk7XHJcbiAgfSxcclxuICBvcGVyYXRlV2luZG93QWN0aW9uczogZnVuY3Rpb24gKGFjdGlvbjogJ2Nsb3NlJyB8ICdtYXgnIHwgJ21pbicpOiB2b2lkIHtcclxuICAgIGlwY1JlbmRlcmVyLnNlbmQoRXZlbnRzLldJTl9BQ1RJT05TLCBhY3Rpb24pO1xyXG4gIH0sXHJcbn07XHJcblxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdjb250ZXh0JywgY29udGV4dEFwaSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==