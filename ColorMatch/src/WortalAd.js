let WORTAL_API_SCRIPT = document.createElement("script");
WORTAL_API_SCRIPT.src = 'https://html5gameportal.com/embeds/wortal-1.1.3.js';
WORTAL_API_SCRIPT.type = 'text/javascript';
// WORTAL_API_SCRIPT.async = true;
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

// Used for when the game is loaded and ready to show after pre-roll.
const onInitWortal = new Event('WortalAdLoaded');
let hasPlayedPreroll = false;

window.addEventListener("load", () => {
    window.initWortal(function () {
        console.log("[Wortal] Initialization complete.");
        wortalIsLoaded = true;

        CallPreroll("Load Game",
            function () {
                // Render the game now.
                RemoveBlackCover();
                window.dispatchEvent(onInitWortal);
            }, function () {
                RemoveBlackCover();
                window.dispatchEvent(onInitWortal);
            });
    });
});

let wortalIsLoaded = false;

function CallAd(type, name, beforeAd, afterAd, adBreakDone, noShow) {
    if (wortalIsLoaded === false) return;
    window.triggerWortalAd(type, name, {
        beforeAd: function () {
            console.log("[Wortal] BeforeAd");
            if (beforeAd) beforeAd();
        },
        afterAd: function () {
            console.log("[Wortal] AfterAd");
            if (afterAd) afterAd();
        },
        adBreakDone: function () {
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
        },
        noShow: function () {
            console.log("[Wortal] NoShow");
            if (noShow) noShow();
        }
    });
}

function CallPreroll(name, adBreakDone, noShow) {
    if (wortalIsLoaded === false) return;
    window.triggerWortalAd(AdTypes.preroll, name, {
        adBreakDone: function () {
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
            hasPlayedPreroll = true;
        },
        noShow: function () {
            console.log("[Wortal] NoShow");
            if (noShow) {
                noShow();
            } else {
                adBreakDone();
            }
            hasPlayedPreroll = true;
        }
    });
}

function RemoveBlackCover() {
    document.getElementById("black-cover").hidden = true;
}