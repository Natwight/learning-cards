// ==============================
// メインビューア表示
// ==============================

import { state } from "./state.js";

import {
    infoValues,
    viewerHint,
    mainImage,
    currentPage,
    totalPage,
    englishWord,
    japaneseMeaning,
    extraInfo1,
    extraInfo2
} from "./elements.js";


// メイン表示を更新する
export function updateViewer() {
    // normalモードなら常に答えを表示
    if (state.currentMode === "normal") {
        state.isInfoVisible = true;
    }

    // hiddenモードなら、カード更新時に答えを隠す
    else if (state.currentMode === "hidden") {
        state.isInfoVisible = false;
    }

    // 表示できる画像がない場合
    if (state.currentImages.length === 0) {
        currentPage.textContent = 0;
        totalPage.textContent = 0;

        mainImage.removeAttribute("src");
        mainImage.alt = "No image";

        englishWord.textContent = "No data";
        japaneseMeaning.textContent = "";
        extraInfo1.textContent = "";
        extraInfo2.textContent = "";

        updateInfoVisibility();
        updateViewerHint();

        return;
    }

    // 現在表示する画像を取得
    const currentItem = state.currentImages[state.currentIndex];

    // ページ数
    currentPage.textContent = state.currentIndex + 1;
    totalPage.textContent = state.currentImages.length;

    // メイン画像
    mainImage.src = currentItem.src;
    mainImage.alt = currentItem.alt;

    // 単語情報
    englishWord.textContent = currentItem.dataset.en || "";
    japaneseMeaning.textContent = currentItem.dataset.ja || "";
    extraInfo1.textContent = currentItem.dataset.info1 || "";
    extraInfo2.textContent = currentItem.dataset.info2 || "";

    updateInfoVisibility();
    updateViewerHint();
}


// 答え部分の表示 / 非表示を切り替える
export function updateInfoVisibility() {
    // まず全て表示状態に戻す
    infoValues.forEach(value => {
        value.classList.remove("is-hidden");
    });

    // hiddenモード、かつ答えがまだ表示されていない場合だけ隠す
    if (state.currentMode === "hidden" && !state.isInfoVisible) {
        infoValues.forEach(value => {
            value.classList.add("is-hidden");
        });
    }
}


// ヒント表示を更新する
export function updateViewerHint() {
    // いったん隠す
    viewerHint.classList.add("is-hidden");

    // hiddenモード、答え未表示、画像ありの場合だけ表示
    if (
        state.currentMode === "hidden" &&
        !state.isInfoVisible &&
        state.currentImages.length > 0
    ) {
        viewerHint.classList.remove("is-hidden");
    }
}