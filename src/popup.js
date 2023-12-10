import { request, fade } from "./request.js"
// storageAPIを使って取得
chrome.storage.local.get(["quick", "auto_copy", "notice_type"], function (items) {
    // クイック取得がONなら
    if (items.quick == true) {
        document.getElementById("quick").checked = true
        // チェックボックスをつける
    }
    // 自動コピーがONなら
    if (items.auto_copy == true) {
        document.getElementById("auto-copy").checked = true
        // チェックボックスをつける
    }
    // 通知タイプの処理
    if (items.notice_type == "off") {
        document.getElementById("notify-select").querySelector("option[value='off']").selected = true
    } else if (items.notice_type == "error") {
        document.getElementById("notify-select").querySelector("option[value='error']").selected = true
    } else {
        document.getElementById("notify-select").querySelector("option[value='on']").selected = true
    }
})
//ページ読み込み時の処理
chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
    const url = e[0].url
    if (url.slice(0, 7) == "http://" || url.slice(0, 8) == "https://") {
        // http:// またはhttps:// から始まるリンクなら(Chrome://とかじゃなく)
        document.getElementById("from-text").value = url

        // storageAPIを使って取得
        chrome.storage.local.get(["quick", "auto_copy"], function (items) {
            // クイック取得がONなら
            if (items.quick == true) {
                url_ajax(url, "")
            }
        })
    }
})

function set_notify () {
    chrome.storage.local.set(
        {
            "notice_type": document.getElementById("notify-select").value
        }
    )
}
// 紐づけ
document.getElementById("notify-select").addEventListener("change", set_notify)

// カスタムリンク表示 非表示処理はなし
function show_custom () {
    document.getElementById("show-custom").parentNode.classList.add("hidden")
    document.getElementById("custom-text").classList.remove("hidden")
}
// 紐づけ(htmlに記述するとセキュリティ対策で発火しない仕様)
document.getElementById("show-custom").addEventListener("click", show_custom)

// オプション表示/非表示
function show_option () {
    document.getElementById("option").classList.toggle("hidden")
    // アイコン
    if (document.getElementById("show-option").checked){
        document.getElementById("show-option-icon").setAttribute("src", "./img/remove_black_24dp.svg")
    } else {
        document.getElementById("show-option-icon").setAttribute("src", "./img/add_black_24dp.svg")
    }
}
// 紐づけ
document.getElementById("show-option").addEventListener("change", show_option)

// 作成ボタンがクリックされたら
function click_create () {
    url_ajax(document.getElementById("from-text").value, document.getElementById("custom-text").value)
}
document.getElementById("send-btn").addEventListener("click", click_create)

// クイック取得のON/OFF
function set_quick () {
    // storageAPIを使って保存
    chrome.storage.local.set(
        {
            "quick": document.getElementById("quick").checked
            // チェック入ってたらtrue
        }
    )
}
document.getElementById("quick").addEventListener("change", set_quick)

// 自動コピーのON/OFF
function set_auto_copy () {
    chrome.storage.local.set(
        {
            "auto_copy": document.getElementById("auto-copy").checked
        }
    )
}
document.getElementById("auto-copy").addEventListener("change", set_auto_copy)

function url_ajax(from_url, custom) {
    // ajaxでデータ送信
    if (from_url == "") {
        // 入力した値のチェック(空じゃないか・http:// か https:// から始まるかどうか)
        document.getElementById("p-1").innerText = "http(s) urlを入力してください!"
        fade("p-1", "error")
    }
    else {
        request({urls: [from_url], custom: custom, context:false})
    }
}