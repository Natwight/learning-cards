// ==============================
// 表示モード切替
// ==============================

import { state } from "./state.js";
import { updateInfoVisibility, updateViewerHint } from "./viewer.js";


// Normal / Hidden を切り替える
export function changeMode(mode) {
    state.currentMode = mode;

    if (state.currentMode === "normal") {
        state.isInfoVisible = true;
    }
    else if (state.currentMode === "hidden") {
        state.isInfoVisible = false;
    }

    updateInfoVisibility();
    updateViewerHint();
}