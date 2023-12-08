import { notice } from "./notice.js"
export function request(object) {
    // fetch APIでデータ送信
    const method = "POST"
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
    let body
    if (object["bundle"]) {
        body = `url1=${encodeURI(object["from1"])}&url2=${encodeURI(object["from2"])}&url3=${encodeURI(object["from3"])}&url4=${encodeURI(object["from4"])}&url5=${encodeURI(object["from5"])}&custom=${encodeURI(object["custom"])}`
    } else {
        body = `url=${encodeURI(object["from1"])}&custom=${encodeURI(object["custom"])}`
    }
    fetch("https://u.yakijake.net/?option=create_extension", { method, headers, body })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not OK')
            }
            return res.json()
        })
        .then((data) => {
            try {
                console.log(data)
                if (data.status == "ok") {
                    // 正常に作られたら
                    if (object["context"]) {
                        const copy_url = `https://u.yakijake.net/${data.text}`
                        // ServiceWorkerではdocumentやnavigator.clipboardでのコピー不可なので、新規タブでcopy.htmlを開いてそこでコピー処理する
                        // 現在タブを取得して後で戻せるようにする
                        chrome.tabs.query({ active: true, lastFocusedWindow: true})
                            .then(tab => {
                                if (tab[0] != undefined) {
                                    chrome.storage.local.set({"tab_id": tab[0].id})
                                    chrome.storage.local.set({"copy_url": copy_url})
                                    chrome.tabs.create({url: 'copy.html'})

                                    // chrome:なんか通知しても右下に出ない(非表示状態で出てくる(?))
                                    notice(`作成されたURL:https://u.yakijake.net/${data.text}\nクリップボードにコピーされました`, false)
                                    if (data.notice) {
                                        notice(data.notice, true)
                                    }
                                } else {
                                    throw new Error('tab is undefined')
                                }
                            }).catch(error => {
                                notice("コピー処理:現在タブの取得に失敗しました",true)
                            })
                    } else {
                        document.getElementById("p-1").innerText = "生成されたURL:"
                        document.getElementById("show-url").innerText = `https://u.yakijake.net/${data.text}`

                        document.getElementById("notice").innerText = `お知らせ:${data.notice}`

                        // storageAPIを使って取得
                        chrome.storage.local.get(["auto_copy"], function (items) {
                            // 自動コピーがONなら
                            if (items.auto_copy == true) {
                                const copy_url = `https://u.yakijake.net/${data.text}`
                                navigator.clipboard.writeText(copy_url)
                                    .then(() => {
                                        document.getElementById("p-1").innerText = "生成されたURL(コピー済):"
                                    }).catch(error => {
                                        /* clipboard write failed */
                                        document.getElementById("p-1").innerText = "コピー処理に失敗しました"
                                    })
                            }
                        })
                    }
                } else {
                    // 生成に失敗したら
                    if (object["context"]) {
                        notice(data.text, true)
                    } else {
                        document.getElementById("p-1").innerText = data.text
                    }
                }
            } catch (error) {
                if (object["context"]) {
                    notice(`データ処理中にエラーが発生しました\n${error}`, true)
                } else {
                    document.getElementById("p-1").innerText = "データ処理中にエラーが発生しました"
                }
            }
            return
        })
        .catch((error) => {
            if (object["context"]) {
                notice(`エラーが発生しました\n${toString(error)}`, true)
            } else {
                document.getElementById("p-1").innerText = `エラーが発生しました\n${toString(error)}`
            }
        })
}