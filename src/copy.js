import { notice } from "./notice.js";
chrome.storage.local.get(["copy_url", "tab_id"])
    .then(items => {
        navigator.clipboard.writeText(items.copy_url)
            .then(() => {
                // 成功:copy.htmlが開く前に選択してたタブを選択する
                chrome.tabs.update(items.tab_id, { highlighted: true });
                
                // 即閉じしちゃうとなぜかコピペされない
                setTimeout(() => {
                    window.close()
                }, 10);
            }).catch(error => {
                /* clipboard write failed */
                notice("コピー処理に失敗しました", true)
                document.getElementById("result").textContent = `短縮結果:${items.copy_url}`
            });
    }).catch(error => {
        notice("コピー処理(テキスト読込)に失敗しました", true)
    });