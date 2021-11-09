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
    adBreak({
        type: type,
        name: name,
    });
}