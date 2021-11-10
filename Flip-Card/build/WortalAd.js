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
    window.triggerWortalAd("next", "Description of your ad", function () {
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