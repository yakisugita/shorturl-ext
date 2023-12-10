import { request } from "./request.js"
import { notice } from "./notice.js"

{
    chrome.runtime.onInstalled.addListener(() => {
        const parent = chrome.contextMenus.create({
            id: 'parent',
            title: '短縮リンク作成'
        })
    })

    // ↑のメニューをクリックした時に実行する
    chrome.contextMenus.onClicked.addListener(item => {
        // 開いてるタブのURL
        chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
            const url = e[0].url;
            console.log(url)
            if (url.slice(0, 7) == "http://" || url.slice(0, 8) == "https://") {
                // 外部ページを開いているときのみリクエスト
                request({urls: [url], custom: "", context:true})
            } else {
                // 外部ページを開いていなかったら
                notice("「新しいタブ」やローカルファイルへのリンクは作成できません。", true)
            }
        })
    })
}