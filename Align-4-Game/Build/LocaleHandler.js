const browserLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase();

console.log("Current browser lang", browserLanguage);

Importi18nScript();


function GetTranslatedText(id) {
    if (!i18n) {
        console.log("i18n is null, retrying...");
        setTimeout(() => {
            return GetTranslatedText(id);
        }, 1000, id)
    } else {

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

    const specificElem = document.querySelectorAll(elementClassName);

    Translate(specificElem);
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

function Importi18nScript() {
    console.log("Importing i18n script...");

    const script = document.createElement("script");
    script.src = "./i18n.js";
    script.type = "text/javascript";
    const head = document.getElementsByTagName("head");
    head[head.length - 1].appendChild(script).onload = () => {
        console.log("i18n loaded");
        TranslateAllPage();
    };
}