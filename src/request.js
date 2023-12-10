import { notice } from "./notice.js"
export async function request(object) {
    // fetch APIでデータ送信
    const method = "POST"
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
    // 新バージョンテスト
    if (object["urls"] && Array.isArray(object["urls"])) {
        console.log(object["urls"])
        const urls = object["urls"]
        // ここでカスタムリンクを判定

        const headers2 = new Headers()
        headers2.append('content-type', 'application/json; Charset=UTF-8')

        const body = {urls:urls, custom:object["custom"], is_strict:false, client:"ext", client_ver:"2.0"}
        const body_json = JSON.stringify(body)
        console.log(body_json)

        const init = { method:'POST', headers:headers2, body:body_json}

        const response = await fetch('https://api.8jsv.com/', init)
        .then((response) => {
            console.log(`status : ${response.status}, text : ${response.statusText}`)
            let error_text
            switch (response.status) {
                case 200:
                    // OK
                    break;

                case 409:
                    // 重複
                    error_text = "カスタムリンクが既に使用済みです"
                    break;

                case 500:
                    // サーバーエラー
                    error_text = "サーバーエラー もう一度お試しください"
                    break;
            
                default:
                    error_text = "エラーです"
                    // 未定義のエラー
                    break;
            }
            if (response.status != 200) {
                // 200 OK以外
                if (object["context"]) {
                    notice(error_text, true)
                } else {
                    document.getElementById("p-1").innerText = error_text
                }
            }
            return response.json()
            
        })
        .then((data) => {
            console.log("catch data",data)

            try {
                console.log(data)
                if (data.err_msg == "") {
                    if (data.id === undefined) {
                        // ID取得できなかったら
                        document.getElementById("p-1").innerText = "失敗しました 再度お試しください"
                    } else {
                        // 正常に作られたら
                        if (object["context"]) {
                            const copy_url = `https://8jsv.com/${data.id}`
                            // ServiceWorkerではdocumentやnavigator.clipboardでのコピー不可なので、新規タブでcopy.htmlを開いてそこでコピー処理する
                            // 現在タブを取得して後で戻せるようにする
                            chrome.tabs.query({ active: true, lastFocusedWindow: true})
                                .then(tab => {
                                    if (tab[0] != undefined) {
                                        chrome.storage.local.set({"tab_id": tab[0].id})
                                        chrome.storage.local.set({"copy_url": copy_url})
                                        chrome.tabs.create({url: 'copy.html'})

                                        // chrome:なんか通知しても右下に出ない(非表示状態で出てくる(?))
                                        notice(`作成されたURL:https://8jsv.com/${data.id}\nコピーしました`, false)
                                    } else {
                                        throw new Error('tab is undefined')
                                    }
                                }).catch(error => {
                                    notice("コピー処理:現在タブの取得に失敗しました",true)
                                })
                        } else {
                            document.getElementById("p-1").innerText = "生成されたURL:"
                            document.getElementById("show-url").innerText = `https://8jsv.com/${data.id}`

                            // storageAPIを使って取得
                            chrome.storage.local.get(["auto_copy"], function (items) {
                                // 自動コピーがONなら
                                if (items.auto_copy == true) {
                                    const copy_url = `https://8jsv.com/${data.id}`
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
                    }
                } else {
                    console.log(data.err_msg)
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
            console.log(e.message)

            if (object["context"]) {
                notice(`エラーが発生しました\n${toString(error)}`, true)
            } else {
                document.getElementById("p-1").innerText = `エラーが発生しました\n${toString(error)}`
            }
        });

        console.log("response:",response)

    } else {
        console.error("no urls")
    }
}