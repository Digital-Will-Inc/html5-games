// translation = {
//     "Tap screen to start" : {
//         "en-us" : "Tap screen to start",
//         "ja" : "画面をタッチしてゲームを始める",
//     },
//     "Score" : {
//         "en-us" : "Score",
//         "ja" : "スコア",
//     }
// };

// function LowerJSON(json) {
//     let newJson = {};
//     Object.keys(json).forEach(function(key) {
//         let newKey = key;
//         if (typeof key === 'string')
//             newKey = key.toLowerCase();
//         if (typeof json[key] === 'string')
//             newJson[newKey] = json[key].toLowerCase();
//         else
//             newJson[newKey] = LowerJSON(json[key]);
//     });
//     return newJson;
// }

// browserLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase();

// elements = document.getElementsByClassName('string');

// translation = LowerJSON(translation);

// function TranslateText() {
//     console.log (browserLanguage);
//     for (i = 0;i < elements.length;i++){
//         let string  = elements[i].innerText.toLowerCase();
//         let newString = "";
//         if (translation[string]){
//             if (translation[string][browserLanguage])
//                 newString = translation[string][browserLanguage];
//             else
//                 newString = string;
//         }
//         else{
//             sections = string.split(":");
//             for (j = 0;j < sections.length;j++){
//                 sections[j] = sections[j].trim();
//                 if (translation[sections[j]])
//                     newString += translation[sections[j]][browserLanguage];
//                 else
//                     newString += sections[j];

//                 if (j != sections.length - 1)
//                     newString += ": ";
//             }
//         }
//         elements[i].innerText = newString;  
//     }
// }