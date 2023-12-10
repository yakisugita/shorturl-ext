import { request } from "./request.js"
// selectに開いてるタブのタイトル・URLを追加していく
chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {

        let log_text
        Object.keys(tab).forEach(function (key) {
            log_text += `${key}:${tab[key]}\n`
        })
        console.log(log_text)

        if (tab.url.slice(0, 7) == "http://" || tab.url.slice(0, 8) == "https://") {
            // http:// またはhttps:// から始まるリンクなら(Chrome://とかじゃなく)
            const option = document.createElement("option")
            option.setAttribute("value", tab.url)

            if (tab.title.length > 50) {
                option.innerText = `${tab.title.slice(0, 50)}...`
            } else {
                option.innerText = tab.title
            }
            if (tab.pinned) {
                document.getElementById("optgroup-pinned").append(option)
            } else {
                document.getElementById("tab-select").append(option)
            }
        }
    })
})

// selectで開いてるタブを選択するとURLが勝手に入る
function select_tab () {
    const selected_value = document.getElementById("tab-select").value
    if (selected_value != "tab-select-default") {
        if (document.getElementById("from-text-1").value == "") {
            document.getElementById("from-text-1").value = selected_value
        } else if (document.getElementById("from-text-2").value == "") {
            document.getElementById("from-text-2").value = selected_value
        } else if (document.getElementById("from-text-3").value == "") {
            document.getElementById("from-text-3").value = selected_value
        } else if (document.getElementById("from-text-4").value == "") {
            document.getElementById("from-text-4").value = selected_value
        } else if (document.getElementById("from-text-5").value == "") {
            document.getElementById("from-text-5").value = selected_value
        } else {
            document.getElementById("p-1").innerText = "エラー:入力ボックスに空きがありません"
        }
        document.getElementById("tab-select-default").selected = true
    }
}
// 紐づけ
document.getElementById("tab-select").addEventListener("change", select_tab)



// カスタムリンク表示 非表示処理はなし
function show_custom () {
    document.getElementById("show-custom").parentNode.classList.add("hidden")
    document.getElementById("custom-text").classList.remove("hidden")
}
// 紐づけ(htmlに記述するとセキュリティ対策で発火しない仕様)
document.getElementById("show-custom").addEventListener("click", show_custom)

function click_create() {
    request({
        custom:document.getElementById("custom-text").value,
        context:false,
        urls:[
            document.getElementById("from-text-1").value,
            document.getElementById("from-text-2").value,
            document.getElementById("from-text-3").value,
            document.getElementById("from-text-4").value,
            document.getElementById("from-text-5").value,
        ]
    });
}
document.getElementById("send-btn").addEventListener("click", click_create)