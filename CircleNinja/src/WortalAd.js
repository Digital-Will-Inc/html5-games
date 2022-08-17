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

// Used to ensure we don't make duplicate calls when we receive both AdBreakDone and NoShow.
let hasAdShown = false;

window.addEventListener("load", () => {
    window.initWortal(function () {
        console.log("[Wortal] Initialization complete.");
        wortalIsLoaded = true;

        CallPreroll("Load Game",
            function () {
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
    hasAdShown = false;
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
            if (hasAdShown) return;
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
            hasAdShown = true;
        },
        noShow: function () {
            if (hasAdShown) return;
            console.log("[Wortal] NoShow");
            if (noShow) noShow();
            hasAdShown = true;
        }
    });
}

function CallPreroll(name, adBreakDone, noShow) {
    if (wortalIsLoaded === false) return;
    window.triggerWortalAd(AdTypes.preroll, name, {
        adBreakDone: function () {
            if (hasPlayedPreroll) return;
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
            hasPlayedPreroll = true;
        },
        noShow: function () {
            if (hasPlayedPreroll) return;
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