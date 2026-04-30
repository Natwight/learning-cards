// ==============================
// HTML要素の取得
// ==============================
// このファイルでは、HTMLから使いたい要素をまとめて取得する。
// 他のJSファイルは、ここから必要な要素を受け取って使う。

// 小タブボタン
export const tabButtons = document.querySelectorAll(".tabs_buttons button");

// 大タブボタン
export const bigTabButtons = document.querySelectorAll(".big_tabs_buttons button");

// 表示モード切替用radioボタン
export const modeRadios = document.querySelectorAll('input[name="displayMode"]');

// Hiddenモードで隠す値部分
export const infoValues = document.querySelectorAll(".info_value");

// Hiddenモード時のヒント
export const viewerHint = document.getElementById("viewerHint");

// サムネイル表示エリア
export const thumbnails = document.getElementById("thumbnails");

// メイン画像
export const mainImage = document.getElementById("mainImage");

// 前へ / 次へボタン
export const prevBtn = document.getElementById("prevBtn");
export const nextBtn = document.getElementById("nextBtn");

// ページ数
export const currentPage = document.getElementById("currentPage");
export const totalPage = document.getElementById("totalPage");

// 単語情報
export const englishWord = document.getElementById("englishWord");
export const japaneseMeaning = document.getElementById("japaneseMeaning");
export const extraInfo1 = document.getElementById("extraInfo1");
export const extraInfo2 = document.getElementById("extraInfo2");