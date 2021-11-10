
const browserLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase();

console.log("Current browser lang", browserLanguage);

function GetTranslatedText(id) {
    for (let i = 0; i < i18n.length; i++) {
        const element = i18n[i];

        if (element.id == id) {
            if (browserLanguage === "ja")
                return element.ja;
            else if (browserLanguage === "en-us")
                return element.en;
            else
                console.warn("Language not supported: " + browserLanguage);
            return element.en;
        }
    }
}



function TranslateAllPage() {
    console.log("Translating all page...");

    const i18nElems = document.getElementsByClassName("i18nElem");
    Translate(i18nElems);
}


function TranslateDynamicElem(elementClassName = "") {
    console.log("Translating specific element...", elementClassName);

    if (elementClassName.length == 0) {
        console.warn("element className is empty");
    }

    const specificElem = document.getElementsByClassName(elementClassName)[0];

    const reqElems = specificElem.getElementsByClassName("i18nElem");
    Translate(reqElems);

}


function Translate(elements) {
    console.log("Translating text...");

    for (i = 0; i < elements.length; i++) {
        let string = elements[i].innerText.toLowerCase();
        let newString = GetTranslatedText(string);

        if (newString == undefined || newString == null) {
            console.warn("Translation not found for: " + string);
        }

        elements[i].innerText = newString;
    }
}