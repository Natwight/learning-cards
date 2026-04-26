// 1. HTML要素の取得
const tabButtons = document.querySelectorAll(".tabs_buttons button"); //ボタンすべてを取得
//querySelectorAll - 条件に一致する要素をすべて取得する　*注 querySelector - 最初の1つの要素を取得
const bigTabButtons = document.querySelectorAll(".big_tabs_buttons button");

const modeRadios = document.querySelectorAll('input[name="displayMode"]');
const infoValues = document.querySelectorAll(".info_value");
const viewerHint = document.getElementById("viewerHint");

const thumbnails = document.getElementById("thumbnails"); //サムネイル表示用sectionを取得

const mainImage = document.getElementById("mainImage"); //viewerの画像要素を取得
const nextBtn = document.getElementById("nextBtn"); //nextボタンの取得
const prevBtn = document.getElementById("prevBtn"); //prevボタンの取得

const page = document.getElementById("page"); //現在のページ
const pageAll = document.getElementById("pageAll"); //全ページ数
const word = document.getElementById("word"); //単語
const meaning = document.getElementById("meaning"); //意味
const info1 = document.getElementById("info1"); //補足1
const info2 = document.getElementById("info2"); //補足2


// 2. 状態管理
let currentImages = []; //NodeList指定
let currentIndex = 0; //数字指定

let currentBig = "big1";
let currentGroup = "group1";
let currentMode = "normal";
let isInfoVisible = true;

let allData = {}; //JSONファイル(data.json)読み込み, {} - オブジェクト指定
let groupLabels = {};

const categoryFiles = {
    big1: "category1.json",
    big2: "category2.json",
    big3: "category3.json",
    big4: "category4.json",
    big5: "category5.json"
};

// 3. 初期化
init();

function init() {
    loadCategoryData().then(() => {
        updateGroupLabels();
        renderThumbnails(currentGroup);
        setupEvents();
    });
}

function loadCategoryData() {
    const fileName = categoryFiles[currentBig];

    return fetch(fileName)
        .then(res => res.json())
        .then(data => {
            allData = data.groups;
            groupLabels = data.groupLabels || {};
        });
}

// 4. 表示更新関数

//サムネイル部に画像等データを追加
function renderThumbnails(groupId) {

    thumbnails.innerHTML = "";

    if (!allData[groupId] || allData[groupId].length === 0) { //存在しないgroupの対策
        thumbnails.innerHTML = "";

        const emptyBox = document.createElement("div");
        emptyBox.classList.add("empty_thumbnail");
        emptyBox.textContent = "No image";

        thumbnails.appendChild(emptyBox);
        
        currentImages = [];
        currentIndex = 0;
        updateViewer();
        return;
    }

    allData[groupId].forEach(item => {
        const addimg = document.createElement("img");

        addimg.src = item.src; //画像のURLを設定
        addimg.dataset.en = item.en; //HTMLのデータ属性に保存
        addimg.dataset.ja = item.ja; //HTMLのデータ属性に保存
        addimg.dataset.info1 = item.info1; //HTMLのデータ属性に保存
        addimg.dataset.info2 = item.info2; //HTMLのデータ属性に保存
        addimg.alt = item.alt || item.en; //HTMLのデータ属性に保存, || - 左がなければ右を使う

        thumbnails.appendChild(addimg); //作成したimgをHTML(対象のsection)に追加
    });

    currentImages = Array.from(thumbnails.querySelectorAll("img"));
    currentIndex = 0;

    updateViewer();
}

//メイン表示更新
function updateViewer() {
    if (currentMode === "normal") {
        isInfoVisible = true;
    }
    else if (currentMode === "hidden") {
        isInfoVisible = false;
    }

    if (currentImages.length === 0) {
        page.textContent = 0;
        pageAll.textContent = 0;
        mainImage.removeAttribute("src");
        mainImage.alt = "No image";
        word.textContent = "No data";
        meaning.textContent = "";
        info1.textContent = "";
        info2.textContent = "";
        updateInfoVisibility();
        updateViewerHint();
        return;
    }

    const currentItem = currentImages[currentIndex];

    page.textContent = currentIndex + 1;
    pageAll.textContent = currentImages.length;
    mainImage.src = currentItem.src;
    mainImage.alt = currentItem.alt;
    word.textContent = currentItem.dataset.en || "";
    meaning.textContent = currentItem.dataset.ja || "";
    info1.textContent = currentItem.dataset.info1 || "";
    info2.textContent = currentItem.dataset.info2 || "";

    updateInfoVisibility();
    updateViewerHint();
}

//表示,非表示切替
function updateInfoVisibility() {
    infoValues.forEach(value => {
        value.classList.remove("is-hidden");
    });

    if (currentMode === "hidden" && !isInfoVisible) {
        infoValues.forEach(value => {
            value.classList.add("is-hidden");
        });        
    }
}

//ヒントの表示切替
function updateViewerHint() {
    viewerHint.classList.add("is-hidden");

    if (currentMode === "hidden" && !isInfoVisible && currentImages.length > 0) {
    //hiddenモード, まだ答えが表示されていない, 画像がある この3つを満たすときのみ
        viewerHint.classList.remove("is-hidden");
    }
}

//小タブ名を書き換える関数
function updateGroupLabels() {
    tabButtons.forEach(button => {
        const groupId = button.dataset.group;
        button.textContent = groupLabels[groupId] || groupId;
    });
}

// 5. 状態変更関数

//選択中の大タブの見た目変化用
function setActiveBigTab(clickedButton) {
    bigTabButtons.forEach(button => {
        button.classList.remove("active");
    });
    clickedButton.classList.add("active");
}

//選択中の小タブの見た目変化用
function setActiveTab(clickedButton) {
    tabButtons.forEach(button => {
        button.classList.remove("active"); //すべてのボタンからclass = "active"を消す
    });
    clickedButton.classList.add("active"); //クリックされたボタンにclass = "active"を付与
}

//小タブをGroup1に戻す
function resetSmallTab() {
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    const firstSmallTab = document.querySelector('.tabs_buttons button[data-group="group1"]');
    firstSmallTab.classList.add("active");
}

//選択されたgroupの表示
function changeGroup(groupId) {
    renderThumbnails(groupId);
}

//表示モード切替
function changeMode(mode) {
    currentMode = mode;

    if (currentMode ==="normal") {
        isInfoVisible = true;
    }
    else if (currentMode === "hidden") {
        isInfoVisible = false;
    }

    updateInfoVisibility();
    updateViewerHint();
}

// 6. イベント設定

//クリックイベント
//画像1つ1つにではなく、親にイベントを付けている(イベント委任)
function setupEvents() {
    thumbnails.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG") {
        //e.target - 実際にクリックされた要素
        //クリックされた要素が画像(img)ならば以下実行, tagNameは大文字で返されるため"IMG"とする
              
            currentIndex = currentImages.indexOf(e.target);
            //indexof - 配列の中で指定した要素が何番目にあるかを返す(配列化したものの中でしか使えない)
                
            updateViewer(); //描画
        }
    });

    //mainImageにクリックイベント
    mainImage.addEventListener("click", () => {
        if (currentMode === "hidden") {
            isInfoVisible = true;
            updateInfoVisibility();
            updateViewerHint();
        }
    });

    //next
    nextBtn.addEventListener("click", () => {
        currentIndex = currentIndex + 1;
        if (currentIndex >= currentImages.length) {
            currentIndex = 0;
        }
        updateViewer();
    });

    //prev
    prevBtn.addEventListener("click", () => {
        currentIndex = currentIndex - 1;
        if (currentIndex < 0 ) {
            currentIndex = currentImages.length - 1;
        }
        updateViewer();
    });

    //すべての大タブボタンにクリックイベント
    bigTabButtons.forEach(button => {
        button.addEventListener("click", () => {
            setActiveBigTab(button);

            currentBig = button.dataset.big;
            currentGroup = "group1";

            resetSmallTab();

            loadCategoryData().then(() => {
                updateGroupLabels();
                changeGroup(currentGroup);
            });
        });
    });

    //すべての小タブボタンにクリックイベント
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            setActiveTab(button);

            currentGroup = button.dataset.group;

            changeGroup(currentGroup);
        });
    });

    //表示モード切替用radioにイベント
    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                changeMode(radio.value);
            }
        });
    });
}


