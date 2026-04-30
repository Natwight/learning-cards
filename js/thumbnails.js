// ==============================
// サムネイル表示
// ==============================

import { state } from "./state.js";
import { thumbnails } from "./elements.js";
import { updateViewer } from "./viewer.js";


// サムネイル一覧を表示する
export function renderThumbnails(groupId) {
    // いったん空にする
    thumbnails.innerHTML = "";

    // groupが存在しない、または中身が空の場合
    if (!state.allData[groupId] || state.allData[groupId].length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.classList.add("empty_thumbnail");
        emptyBox.textContent = "No image";

        thumbnails.appendChild(emptyBox);

        state.currentImages = [];
        state.currentIndex = 0;

        updateViewer();

        return;
    }

    // group内のデータをimgタグに変換
    state.allData[groupId].forEach(item => {
        const addimg = document.createElement("img");

        addimg.src = item.src;

        // 単語情報をHTMLのdata属性に保存
        addimg.dataset.en = item.en;
        addimg.dataset.ja = item.ja;
        addimg.dataset.info1 = item.info1;
        addimg.dataset.info2 = item.info2;

        addimg.alt = item.alt || item.en;

        thumbnails.appendChild(addimg);
    });

    // 生成したimgを配列として保存
    state.currentImages = Array.from(thumbnails.querySelectorAll("img"));

    // グループ切替時は1枚目に戻す
    state.currentIndex = 0;

    updateViewer();
}