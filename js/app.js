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
    viewerImageArea,
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


// 次のカードへ移動
function showNextCard() {
    if (state.currentImages.length === 0) {
        return;
    }

    state.currentIndex = state.currentIndex + 1;

    if (state.currentIndex >= state.currentImages.length) {
        state.currentIndex = 0;
    }

    updateViewer();
    playSlideAnimation("next");
}


// 前のカードへ移動
function showPrevCard() {
    if (state.currentImages.length === 0) {
        return;
    }

    state.currentIndex = state.currentIndex - 1;

    if (state.currentIndex < 0) {
        state.currentIndex = state.currentImages.length - 1;
    }

    updateViewer();
    playSlideAnimation("prev");
}


// スライドアニメーションを再生
function playSlideAnimation(direction) {
    // いったんアニメーション用クラスを外す
    viewerImageArea.classList.remove("is-slide-next", "is-slide-prev");

    /*
      同じ方向へ連続で移動した時にも
      アニメーションを再発火させるための処理。
    */
    void viewerImageArea.offsetWidth;

    if (direction === "next") {
        viewerImageArea.classList.add("is-slide-next");
    }
    else if (direction === "prev") {
        viewerImageArea.classList.add("is-slide-prev");
    }
}


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
        showNextCard();
    });


    // ------------------------------
    // prevボタン
    // ------------------------------
    prevBtn.addEventListener("click", () => {
        showPrevCard();
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


    // ------------------------------
    // 画像エリアのフリック操作
    // ------------------------------

    // タッチ開始位置
    let touchStartX = 0;
    let touchStartY = 0;

    // タッチ終了位置
    let touchEndX = 0;
    let touchEndY = 0;

    // フリックとして判定する最小距離
    const swipeMinDistance = 50;

    viewerImageArea.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
    });

    viewerImageArea.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // 横方向より縦方向の動きが大きい場合は、スクロール操作とみなして何もしない
        if (Math.abs(diffY) > Math.abs(diffX)) {
            return;
        }

        // 動きが短すぎる場合は、フリックではないと判断
        if (Math.abs(diffX) < swipeMinDistance) {
            return;
        }

        // 左フリック → 次へ
        if (diffX < 0) {
            showNextCard();
        }

        // 右フリック → 前へ
        else {
            showPrevCard();
        }
    });
}
