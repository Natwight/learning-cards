// ==============================
// 1. HTML要素の取得
// ==============================

// 小タブボタンをすべて取得
const tabButtons = document.querySelectorAll(".tabs_buttons button");
// querySelectorAll - 条件に一致する要素をすべて取得する
// ※ querySelector は最初の1つだけ取得する

// 大タブボタンをすべて取得
const bigTabButtons = document.querySelectorAll(".big_tabs_buttons button");

// 表示モード切替用のradioボタンをすべて取得
const modeRadios = document.querySelectorAll('input[name="displayMode"]');

// Hiddenモードで隠す対象になる値部分をすべて取得
const infoValues = document.querySelectorAll(".info_value");

// Hiddenモード時に表示するヒント
const viewerHint = document.getElementById("viewerHint");

// サムネイル表示用sectionを取得
const thumbnails = document.getElementById("thumbnails");

// メイン画像要素を取得
const mainImage = document.getElementById("mainImage");

// next / prev ボタンを取得
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// ページ数表示
const currentPage = document.getElementById("currentPage"); // 現在のページ番号
const totalPage = document.getElementById("totalPage"); // 全ページ数

// 単語情報表示
const englishWord = document.getElementById("englishWord"); // 英単語
const japaneseMeaning = document.getElementById("japaneseMeaning"); // 日本語の意味
const extraInfo1 = document.getElementById("extraInfo1"); // 補足情報1
const extraInfo2 = document.getElementById("extraInfo2"); // 補足情報2


// ==============================
// 2. 状態管理
// ==============================

// 現在表示中グループのサムネイル画像を入れる配列
let currentImages = [];

// 現在表示している画像が、currentImages の何番目かを表す
let currentIndex = 0;

// 現在選択中の大カテゴリ
let currentBig = "big1";

// 現在選択中の小グループ
let currentGroup = "group1";

// 現在の表示モード
// normal : 答えを表示
// hidden : 答えを隠す
let currentMode = "normal";

// Hiddenモード時に、答えが表示されているかどうか
let isInfoVisible = true;

// JSONから読み込んだ group データを入れる
let allData = {};

// JSONから読み込んだ group 名を入れる
let groupLabels = {};

// 大カテゴリとJSONファイルの対応表
const categoryFiles = {
    big1: "category1.json",
    big2: "category2.json",
    big3: "category3.json",
    big4: "category4.json",
    big5: "category5.json"
};


// ==============================
// 3. 初期化
// ==============================

// アプリ起動
init();

function init() {
    // 最初に現在の大カテゴリに対応するJSONを読み込む
    loadCategoryData().then(() => {
        // 小タブ名をJSONのgroupLabelsに合わせて更新
        updateGroupLabels();

        // 初期グループのサムネイルを表示
        renderThumbnails(currentGroup);

        // イベントを設定
        setupEvents();
    });
}


// ==============================
// 4. データ読み込み
// ==============================

function loadCategoryData() {
    // 現在の大カテゴリに対応するJSONファイル名を取得
    const fileName = categoryFiles[currentBig];

    // JSONファイルを読み込む
    return fetch(fileName)
        .then(res => res.json())
        .then(data => {
            // groupsがなければ空オブジェクトにしておく
            allData = data.groups || {};

            // groupLabelsがなければ空オブジェクトにしておく
            groupLabels = data.groupLabels || {};
        });
}


// ==============================
// 5. 表示更新関数
// ==============================

// サムネイル部に画像データを追加する
function renderThumbnails(groupId) {
    // いったんサムネイル表示を空にする
    thumbnails.innerHTML = "";

    // groupが存在しない、または中身が空の場合の処理
    if (!allData[groupId] || allData[groupId].length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.classList.add("empty_thumbnail");
        emptyBox.textContent = "No image";

        thumbnails.appendChild(emptyBox);

        // 表示対象の画像配列を空にする
        currentImages = [];

        // 先頭に戻す
        currentIndex = 0;

        // メインビューアも空状態に更新
        updateViewer();

        return;
    }

    // group内のデータを1つずつ画像タグに変換する
    allData[groupId].forEach(item => {
        const addimg = document.createElement("img");

        // 画像URL
        addimg.src = item.src;

        // datasetに単語情報を保存
        // datasetに入れておくと、クリックされたimgから情報を取り出しやすい
        addimg.dataset.en = item.en;
        addimg.dataset.ja = item.ja;
        addimg.dataset.info1 = item.info1;
        addimg.dataset.info2 = item.info2;

        // altがJSONにあればそれを使い、なければ英単語を使う
        addimg.alt = item.alt || item.en;

        // 作成したimgをサムネイルエリアに追加
        thumbnails.appendChild(addimg);
    });

    // サムネイル内のimgを配列として保存
    currentImages = Array.from(thumbnails.querySelectorAll("img"));

    // グループ切替時は1枚目に戻す
    currentIndex = 0;

    // メインビューアを更新
    updateViewer();
}


// メイン表示更新
function updateViewer() {
    // normalモードなら、常に答えを表示する
    if (currentMode === "normal") {
        isInfoVisible = true;
    }

    // hiddenモードなら、カード更新時に答えを隠す
    else if (currentMode === "hidden") {
        isInfoVisible = false;
    }

    // 表示できる画像がない場合
    if (currentImages.length === 0) {
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
    const currentItem = currentImages[currentIndex];

    // ページ数を更新
    currentPage.textContent = currentIndex + 1;
    totalPage.textContent = currentImages.length;

    // メイン画像を更新
    mainImage.src = currentItem.src;
    mainImage.alt = currentItem.alt;

    // 単語情報を更新
    englishWord.textContent = currentItem.dataset.en || "";
    japaneseMeaning.textContent = currentItem.dataset.ja || "";
    extraInfo1.textContent = currentItem.dataset.info1 || "";
    extraInfo2.textContent = currentItem.dataset.info2 || "";

    // Hiddenモードの表示状態を反映
    updateInfoVisibility();

    // ヒント表示を更新
    updateViewerHint();
}


// 答え部分の表示 / 非表示を切り替える
function updateInfoVisibility() {
    // まずすべて表示状態に戻す
    infoValues.forEach(value => {
        value.classList.remove("is-hidden");
    });

    // hiddenモード、かつ答えがまだ表示されていない場合だけ隠す
    if (currentMode === "hidden" && !isInfoVisible) {
        infoValues.forEach(value => {
            value.classList.add("is-hidden");
        });
    }
}


// ヒントの表示 / 非表示を切り替える
function updateViewerHint() {
    // いったん隠す
    viewerHint.classList.add("is-hidden");

    // hiddenモード、まだ答えが表示されていない、画像がある
    // この3つを満たすときだけヒントを表示する
    if (currentMode === "hidden" && !isInfoVisible && currentImages.length > 0) {
        viewerHint.classList.remove("is-hidden");
    }
}


// 小タブ名を書き換える
function updateGroupLabels() {
    tabButtons.forEach(button => {
        const groupId = button.dataset.group;

        // groupLabelsに名前があればそれを使う
        // なければ group1 などのIDをそのまま表示
        button.textContent = groupLabels[groupId] || groupId;
    });
}


// ==============================
// 6. 状態変更関数
// ==============================

// 選択中の大タブの見た目を変更する
function setActiveBigTab(clickedButton) {
    bigTabButtons.forEach(button => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");
}


// 選択中の小タブの見た目を変更する
function setActiveTab(clickedButton) {
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");
}


// 小タブを group1 に戻す
function resetSmallTab() {
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    const firstSmallTab = document.querySelector('.tabs_buttons button[data-group="group1"]');

    if (firstSmallTab) {
        firstSmallTab.classList.add("active");
    }
}


// 選択されたgroupを表示する
function changeGroup(groupId) {
    renderThumbnails(groupId);
}


// 表示モードを切り替える
function changeMode(mode) {
    currentMode = mode;

    if (currentMode === "normal") {
        isInfoVisible = true;
    }
    else if (currentMode === "hidden") {
        isInfoVisible = false;
    }

    updateInfoVisibility();
    updateViewerHint();
}


// ==============================
// 7. イベント設定
// ==============================

function setupEvents() {
    // ------------------------------
    // サムネイルクリック
    // ------------------------------
    // 画像1つ1つではなく、親のthumbnailsにイベントを付けている
    // これをイベント委任という
    thumbnails.addEventListener("click", (e) => {
        // 実際にクリックされた要素がimgなら実行
        // tagNameは大文字で返るため "IMG" と比較する
        if (e.target.tagName === "IMG") {
            // クリックされた画像が currentImages の何番目かを調べる
            currentIndex = currentImages.indexOf(e.target);

            // メインビューアを更新
            updateViewer();
        }
    });


    // ------------------------------
    // メイン画像クリック
    // ------------------------------
    // Hiddenモード時、画像をクリックすると答えを表示する
    mainImage.addEventListener("click", () => {
        if (currentMode === "hidden") {
            isInfoVisible = true;

            updateInfoVisibility();
            updateViewerHint();
        }
    });


    // ------------------------------
    // nextボタン
    // ------------------------------
    nextBtn.addEventListener("click", () => {
        // 画像がない場合は何もしない
        if (currentImages.length === 0) {
            return;
        }

        currentIndex = currentIndex + 1;

        // 最後の次は先頭に戻る
        if (currentIndex >= currentImages.length) {
            currentIndex = 0;
        }

        updateViewer();
    });


    // ------------------------------
    // prevボタン
    // ------------------------------
    prevBtn.addEventListener("click", () => {
        // 画像がない場合は何もしない
        if (currentImages.length === 0) {
            return;
        }

        currentIndex = currentIndex - 1;

        // 先頭の前は最後に戻る
        if (currentIndex < 0) {
            currentIndex = currentImages.length - 1;
        }

        updateViewer();
    });


    // ------------------------------
    // 大タブクリック
    // ------------------------------
    bigTabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // 大タブの見た目を更新
            setActiveBigTab(button);

            // 現在の大カテゴリを更新
            currentBig = button.dataset.big;

            // 大カテゴリを変えたら小グループはgroup1に戻す
            currentGroup = "group1";

            // 小タブの見た目もgroup1に戻す
            resetSmallTab();

            // 新しいカテゴリJSONを読み込んでから表示更新
            loadCategoryData().then(() => {
                updateGroupLabels();
                changeGroup(currentGroup);
            });
        });
    });


    // ------------------------------
    // 小タブクリック
    // ------------------------------
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // 小タブの見た目を更新
            setActiveTab(button);

            // 現在の小グループを更新
            currentGroup = button.dataset.group;

            // 選択グループを表示
            changeGroup(currentGroup);
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