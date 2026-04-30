// ==============================
// JSONデータ読み込み
// ==============================

import { state, categoryFiles } from "./state.js";

export function loadCategoryData() {
    // 現在の大カテゴリに対応するJSONファイル名を取得
    const fileName = categoryFiles[state.currentBig];

    return fetch(fileName)
        .then(res => res.json())
        .then(data => {
            // groupsがなければ空オブジェクトにする
            state.allData = data.groups || {};

            // groupLabelsがなければ空オブジェクトにする
            state.groupLabels = data.groupLabels || {};
        });
}