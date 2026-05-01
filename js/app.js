// ==============================
// アプリ全体の起動・イベント設定
// ==============================

import { state } from "./state.js";

import {
    tabButtons,
    bigTabButtons,
    modeRadios,
    thumbnails,
    mainImage,
    nextBtn,
    prevBtn
} from "./elements.js";

import { loadCategoryData } from "./dataLoader.js";

import { renderThumbnails } from "./thumbnails.js";

import {
    updateViewer,
    updateInfoVisibility,
    updateViewerHint
} from "./viewer.js";

import { changeMode } from "./mode.js";

import {
    updateGroupLabels,
    setActiveBigTab,
    setActiveTab,
    resetSmallTab
} from "./tabs.js";


// ==============================
// 初期化
// ==============================

init();

function init() {
    // 最初のカテゴリJSONを読み込む
    loadCategoryData().then(() => {
        // 小タブ名を更新
        updateGroupLabels();

        // 最初のグループを表示
        renderThumbnails(state.currentGroup);

        // イベント設定
        setupEvents();
    });
}


// ==============================
// イベント設定
// ==============================

function setupEvents() {
    // ------------------------------
    // サムネイルクリック
    // ------------------------------
    thumbnails.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG") {
            state.currentIndex = state.currentImages.indexOf(e.target);
            updateViewer();
        }
    });


    // ------------------------------
    // メイン画像クリック
    // ------------------------------
    // Hiddenモード時、画像をクリックすると答えを表示する
    mainImage.addEventListener("click", () => {
        if (state.currentMode === "hidden") {
        
            // 答えを表示状態にする
            state.isInfoVisible = true;

            // 単語情報の表示 / 非表示だけ更新する
            updateInfoVisibility();

            // ヒント表示も更新する
            updateViewerHint();
        }
    });


    // ------------------------------
    // nextボタン
    // ------------------------------
    nextBtn.addEventListener("click", () => {
        if (state.currentImages.length === 0) {
            return;
        }

        state.currentIndex = state.currentIndex + 1;

        if (state.currentIndex >= state.currentImages.length) {
            state.currentIndex = 0;
        }

        updateViewer();
    });


    // ------------------------------
    // prevボタン
    // ------------------------------
    prevBtn.addEventListener("click", () => {
        if (state.currentImages.length === 0) {
            return;
        }

        state.currentIndex = state.currentIndex - 1;

        if (state.currentIndex < 0) {
            state.currentIndex = state.currentImages.length - 1;
        }

        updateViewer();
    });


    // ------------------------------
    // 大タブクリック
    // ------------------------------
    bigTabButtons.forEach(button => {
        button.addEventListener("click", () => {
            setActiveBigTab(button);

            state.currentBig = button.dataset.big;
            state.currentGroup = "group1";

            resetSmallTab();

            loadCategoryData().then(() => {
                updateGroupLabels();
                renderThumbnails(state.currentGroup);
            });
        });
    });


    // ------------------------------
    // 小タブクリック
    // ------------------------------
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            setActiveTab(button);

            state.currentGroup = button.dataset.group;

            renderThumbnails(state.currentGroup);
        });
    });


    // ------------------------------
    // 表示モード切替
    // ------------------------------
    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                changeMode(radio.value);
            }
        });
    });
}