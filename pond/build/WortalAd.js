var WORTAL_API_SCRIPT = document.createElement("script");
WORTAL_API_SCRIPT.src = "https://html5gameportal.com/embeds/wortal-1.1.2.js";
WORTAL_API_SCRIPT.type = 'text/javascript';
WORTAL_API_SCRIPT.async = true;
const head = document.getElementsByTagName("head");
head[head.length - 1].appendChild(WORTAL_API_SCRIPT);

const AdTypes = {
    preroll: "preroll",
    start: 'start',
    pause: 'pause',
    next: 'next',
    browse: 'browse',
    rewardedAd: 'reward',
}

const onInitWortal = new Event('WortalAdLoaded');



document.onreadystatechange = () => {
    ToggleBody(false);
}


window.addEventListener("load", () => {
    window.initWortal(function () {
        console.log("Wortal setup complete!");
        wortalIsLoaded = true;
        setTimeout(() => {
            ToggleBody(true);
            CallPreroll("Load Game",
                function () {
                    // Render the game now.
                    window.dispatchEvent(onInitWortal);
                });
        }, 100);
    });
});


var wortalIsLoaded = false;
function CallAd(type, name, beforeAd, afterAd, adBreakDone, noShow) {
    if (wortalIsLoaded == false) return;
    window.triggerWortalAd(type, name, {
        beforeAd: function () {
            console.log("Call beforeAd");
            if (beforeAd) beforeAd();
        },
        afterAd: function () {
            console.log("Call afterAd");
            if (afterAd) afterAd();
        },
        adBreakDone: function () {
            console.log("Call adBreakDone");
            if (adBreakDone) adBreakDone();
        },
        noShow: function () {
            console.log("Call noShow");
            if (noShow) noShow();
        }
    });
}

function CallPreroll(name, adBreakDone, noShow) {
    if (wortalIsLoaded == false) return;
    window.triggerWortalAd(AdTypes.preroll, name, {
        adBreakDone: function () {
            console.log("Call adBreakDone");
            if (adBreakDone) adBreakDone();
        },

    });
}

function ToggleBody(state) {
    if (state == true) {
        document.querySelector("body").style.display = "";
    } else {
        document.querySelector("body").style.display = "none";
    }
}