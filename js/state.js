// ==============================
// 状態管理
// ==============================
// アプリ全体で共有する「現在の状態」をまとめる。
// state.currentIndex のようにして他ファイルから使う。

export const state = {
    // 現在表示中グループのサムネイル画像配列
    currentImages: [],

    // 現在表示中の画像番号
    currentIndex: 0,

    // 現在選択中の大カテゴリ
    currentBig: "big1",

    // 現在選択中の小グループ
    currentGroup: "group1",

    // 表示モード
    // normal : 答えを表示
    // hidden : 答えを隠す
    currentMode: "normal",

    // Hiddenモード時に答えが表示されているかどうか
    isInfoVisible: true,

    // JSONから読み込んだgroupsデータ
    allData: {},

    // JSONから読み込んだ小タブ名
    groupLabels: {}
};

// 大カテゴリとJSONファイルの対応表
export const categoryFiles = {
    big1: "category1.json",
    big2: "category2.json",
    big3: "category3.json",
    big4: "category4.json",
    big5: "category5.json"
};