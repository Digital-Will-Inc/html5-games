translation = {
    "start": {
        "en-us": "start",
        "ja": "スタート",
    },
    "controls": {
        "en-us": "controls",
        "ja": "操作"
    },
    "keyboard": {
        "en-us": "keyboard",
        "ja": "キーボード"
    },
    "touch": {
        "en-us": "touch",
        "ja": "タッチ"
    },
    "Leap Motion Controller": {
        "en-us": "leap motion contoroller",
        "ja": "Leap モーションコントローラー"
    },
    "gamepad": {
        "en-us": "gamepad",
        "ja": "ゲームパッド"
    },
    "quality": {
        "en-us": "quality",
        "ja": "解像度"
    },
    "low": {
        "en-us": "low",
        "ja": "低い"
    },
    "high": {
        "en-us": "high",
        "ja": "高い"
    },
    "very high": {
        "en-us": "very high",
        "ja": "とても高い"
    },
    "hud": {
        "en-us": "hud",
        "ja": "hud"
    },
    "on": {
        "en-us": "on",
        "ja": "オン"
    },
    "off": {
        "en-us": "off",
        "ja": "オフ"
    },
    "credits": {
        "en-us": "credits",
        "ja": "クレジット"
    },
    "hexgldesc": {
        "en": "HexGL is a futuristic, fast-paced racing game",
        "ja": "HexGLは、未来的でハイペースなレーシングゲームです。"
    },
    "hexgltutorial": {
        "en": "Tap & hold to accelerate\nSwipe to move left and right",
        "ja": "タップ長押しで加速\n左右にスワイプして操作"
    },
    "CLICK/TOUCH TO CONTINUE.": {
        "en": "CLICK/TOUCH TO CONTINUE.",
        "ja": "クリック、またはタッチして次へ"
    }
};

function LowerJSON(json) {
    let newJson = {};
    Object.keys(json).forEach(function (key) {
        let newKey = key;
        if (typeof key === 'string') {
            newKey = key.toLowerCase();
        }
        if (typeof json[key] === 'string') {
            newJson[newKey] = json[key].toLowerCase();
        } else {
            newJson[newKey] = LowerJSON(json[key]);
        }
    });
    return newJson;
}

let browserLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
let elements = document.getElementsByClassName('string');
let translation = LowerJSON(translation);

function TranslateText() {
    for (let i = 0; i < elements.length; i++) {
        let string = elements[i].innerText.toLowerCase();
        let newString = "";
        if (translation[string]) {
            if (translation[string][browserLanguage]) {
                newString = translation[string][browserLanguage];
            } else {
                newString = string;
            }
        } else {
            let sections = string.split(":");
            for (let j = 0; j < sections.length; j++) {
                sections[j] = sections[j].trim();
                if (translation[sections[j]]) {
                    newString += translation[sections[j]][browserLanguage];
                } else {
                    newString += sections[j];
                }
                if (j !== sections.length - 1) {
                    newString += ": ";
                }
            }
        }
        elements[i].innerText = newString;
    }
}