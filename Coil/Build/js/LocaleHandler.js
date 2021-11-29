translation = {
    "Start Game" : {
        "en-us" : "Start Game",
        "ja" : "スタート",
    },
    "Enclose the blue orbs before they explode. Gain bonus points by enclosing multiple orbs at once." : {
        "en-us" : "Enclose the blue orbs before they explode. Gain bonus points by enclosing multiple orbs at once.",
        "ja" : "スタート",
    },
    "Your Score:" : {
        "en-us" : "Your Score:",
        "ja" : "スコア",
    },
    "Instructions" : {
        "en-us" : "Instructions",
        "ja" : "スタート",
    },
    "ENERGY:" : {
        "en-us" : "ENERGY:",
        "ja" : "スタート",
    },
    "MULTIPLIER:" : {
        "en-us" : "MULTIPLIER:",
        "ja" : "スタート",
    },
    "TIME:" : {
        "en-us" : "TIME:",
        "ja" : "スタート",
    },
    "SCORE:" : {
        "en-us" : "SCORE:",
        "ja" : "スタート",
    },
};

function LowerJSON(json) {
    let newJson = {};
    Object.keys(json).forEach(function(key) {
        let newKey = key;
        if (typeof key === 'string')
            newKey = key.toLowerCase();
        if (typeof json[key] === 'string')
            newJson[newKey] = json[key];
        else
            newJson[newKey] = LowerJSON(json[key]);
    });
    return newJson;
}

browserLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase();

elements = document.getElementsByClassName('string');

translation = LowerJSON(translation);

function TranslateText() {
    for (i = 0;i < elements.length;i++){
        let string  = elements[i].innerText.toLowerCase();
        let newString = "";
        if (translation[string]){
            if (translation[string][browserLanguage])
                newString = translation[string][browserLanguage];
            else
                newString = string;
        }
        else{
            sections = string.split(":");
            for (j = 0;j < sections.length;j++){
                sections[j] = sections[j].trim();
                if (translation[sections[j]])
                    newString += translation[sections[j]][browserLanguage];
                else
                    newString += sections[j];
    
                if (j != sections.length - 1)
                    newString += ": ";
            }
        }
        elements[i].innerText = newString;  
    }
}

function TranslationOf(text){
    return translation[text.toLowerCase()][browserLanguage];
}

TranslateText();