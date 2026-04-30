// ==============================
// タブ操作
// ==============================

import { state } from "./state.js";
import { tabButtons, bigTabButtons } from "./elements.js";


// 小タブ名をJSONのgroupLabelsに合わせて更新
export function updateGroupLabels() {
    tabButtons.forEach(button => {
        const groupId = button.dataset.group;

        button.textContent = state.groupLabels[groupId] || groupId;
    });
}


// 選択中の大タブの見た目を変更
export function setActiveBigTab(clickedButton) {
    bigTabButtons.forEach(button => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");
}


// 選択中の小タブの見た目を変更
export function setActiveTab(clickedButton) {
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");
}


// 小タブをgroup1に戻す
export function resetSmallTab() {
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    const firstSmallTab = document.querySelector('.tabs_buttons button[data-group="group1"]');

    if (firstSmallTab) {
        firstSmallTab.classList.add("active");
    }
}