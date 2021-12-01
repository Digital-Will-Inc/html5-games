translation = {
	"Select a size" : {
		"ja" : "--",
		"en-us" : "Select a size",
	 },
	"NumberCanBeEntered" : {
		"ja" : "--",
		"en-us" : "NumberCanBeEntered",
	 },
	"Can you fill out the remaining dots?" : {
		"ja" : "--",
		"en-us" : "Can you fill out the remaining dots?",
	 },
	"This one should be easy..." : {
		"ja" : "--",
		"en-us" : "This one should be easy...",
	 },
	"Select a size to play..." : {
		"ja" : "--",
		"en-us" : "Select a size to play...",
	 },
	"To make it see three dots it needs two more..." : {
		"ja" : "--",
		"en-us" : "To make it see three dots it needs two more...",
	 },
	"Loading" : {
		"ja" : "--",
		"en-us" : "Loading",
	 },
	"Their numbers tell how many" : {
		"ja" : "--",
		"en-us" : "Their numbers tell how many",
	 },
	"But red dots block their view!" : {
		"ja" : "--",
		"en-us" : "But red dots block their view!",
	 },
	"Play" : {
		"ja" : "--",
		"en-us" : "Play",
	 },
	"How to play" : {
		"ja" : "--",
		"en-us" : "How to play",
	 },
	"It's 0h h1's companion!" : {
		"ja" : "--",
		"en-us" : "It's 0h h1's companion!",
	 },
	"So this 2 can only see dots on the right" : {
		"ja" : "--",
		"en-us" : "So this 2 can only see dots on the right",
	 },
	"About" : {
		"ja" : "--",
		"en-us" : "About",
	 },
	"Two dots. These. Tap to make them blue" : {
		"ja" : "--",
		"en-us" : "Two dots. These. Tap to make them blue",
	 },
	"This one doesnt seem right" : {
		"ja" : "--",
		"en-us" : "This one doesnt seem right",
	 },
	"Looking further in one direction would exceed this number" : {
		"ja" : "--",
		"en-us" : "Looking further in one direction would exceed this number",
	 },
	"Blue dots can see others in their own row and column" : {
		"ja" : "--",
		"en-us" : "Blue dots can see others in their own row and column",
	 },
	"This number cant see enough" : {
		"ja" : "--",
		"en-us" : "This number cant see enough",
	 },
	"One specific dot is included in all solutions imaginable" : {
		"ja" : "--",
		"en-us" : "One specific dot is included in all solutions imaginable",
	 },
	"This number can see all its dots" : {
		"ja" : "--",
		"en-us" : "This number can see all its dots",
	 },
	"This number sees a bit too much" : {
		"ja" : "--",
		"en-us" : "This number sees a bit too much",
	 },
	"A blue dot should always see at least one other" : {
		"ja" : "--",
		"en-us" : "A blue dot should always see at least one other",
	 },
	"Now close its path. Tap twice for a red dot" : {
		"ja" : "--",
		"en-us" : "Now close its path. Tap twice for a red dot",
	 },
	"This 1 should see only one. It already does - below!" : {
		"ja" : "--",
		"en-us" : "This 1 should see only one. It already does - below!",
	 },
	"So its other path can be closed. Go ahead..." : {
		"ja" : "--",
		"en-us" : "So its other path can be closed. Go ahead...",
	 },
	"Only one direction remains for this number to look in" : {
		"ja" : "--",
		"en-us" : "Only one direction remains for this number to look in",
	 },
	"You can now continue your previous game" : {
		"ja" : "--",
		"en-us" : "You can now continue your previous game",
	 },
	"These dont seem right" : {
		"ja" : "--",
		"en-us" : "These dont seem right",
	 },
	"This 3 cant see left or right. But it does see a dot above" : {
		"ja" : "--",
		"en-us" : "This 3 cant see left or right. But it does see a dot above",
	 },
}

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

translation = LowerJSON(translation);

function TranslateText() {
	elements = document.getElementsByClassName('string');

    for (i = 0;i < elements.length;i++){
        let string  = elements[i].innerText.toLowerCase().trim();
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
	if (translation && translation[text.toLowerCase()] && translation[text.toLowerCase()][browserLanguage])
    	return translation[text.toLowerCase()][browserLanguage];
	return text;
}

setInterval(TranslateText(),1000);