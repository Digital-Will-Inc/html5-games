var WORTAL_API_SCRIPT = document.createElement("script");
WORTAL_API_SCRIPT.src = "https://html5gameportal.com/embeds/wortal-1.1.0.js";
WORTAL_API_SCRIPT.type = 'text/javascript';
const head = document.getElementsByTagName("head");
head[head.length - 1].appendChild(WORTAL_API_SCRIPT);

const AdTypes = {
    interstitailAd: 'start',
    rewardedAd: 'reward',
}

window.addEventListener("load", () => {
    window.initWortal(function () {
        console.log("Wortal setup complete!");
        setTimeout(() => {
            CallAd(AdTypes.interstitailAd, "Interstitial Ad");
        }, 100);
    });
});


function CallAd(type, name) {
    window.triggerWortalAd(type, name,
        function () {
            console.log("I get called before the ad!");
        },
        function () {
            console.log("I get called after the ad!");
        },
        function () {
            console.log("I get called if the ad doesn't show.");
        }
    );
}