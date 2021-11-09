


const browserLanguage = "ja"/* (window.navigator.userLanguage || window.navigator.language).toLowerCase(); */
const i18nElems = document.getElementsByClassName('i18nElem');

console.log("Current browser lang", browserLanguage);

function GetTranslatedText(id) {
    for (let i = 0; i < i18n.length; i++) {
        const element = i18n[i];

        if (element.id == id) {
            if (browserLanguage === "ja")
                return element.jp;
            else if (browserLanguage === "en-us")
                return element.en;
            else
                console.warn("Language not supported: " + browserLanguage);
            return element.en;
        }
    }
}

function TranslateText() {
    console.log("Translating text...");

    for (i = 0; i < i18nElems.length; i++) {
        let string = i18nElems[i].innerText.toLowerCase();
        let newString = GetTranslatedText(string);;

        if (newString == undefined || newString == null) {
            console.warn("Translation not found for: " + string);
        }

        i18nElems[i].innerText = newString;
    }
}