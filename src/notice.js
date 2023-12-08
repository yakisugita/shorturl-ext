export function notice(message, err) {
    // storageAPIを使って取得
    chrome.storage.local.get(["notice_type"], function (items) {
        if (items.notice_type == "off") {
            // 通知タイプが「オフ」なら
        } else if(items.notice_type == "error") {
            //「エラーのみ」ならエラーのみ表示
            if (err == true){
                chrome.notifications.create({
                    iconUrl: "./icon3.png",
                    title: "短縮リンク作成",
                    message: message,
                    contextMessage: "エラー/お知らせ",
                    type: "basic"
                })
            }
        } else {
            // 指定されていないか通知タイプが「オン」なら通知を表示
            chrome.notifications.create({
                iconUrl: "./icon3.png",
                title: "短縮リンク作成",
                message: message,
                type: "basic"
            })
        }
    })
}