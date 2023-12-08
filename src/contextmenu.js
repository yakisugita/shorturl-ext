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
            if (url.slice(0, 7) == "http://" || url.slice(0, 8) == "https://" || url != null) {
                // 外部ページを開いているときのみリクエスト
                request({from1: url, custom: "", bundle:false, context:true})
            } else {
                // 外部ページを開いていなかったら
                notice("外部ページを開いているタブ内でご使用ください。\n「新しいタブ」やローカルファイルへのリンクは作成できません。", true)
            }
        })
    })
}