/**
 * Calls for an interstitial ad to be shown.
 * @param placement Placement type of the ad. Options: 'next', 'pause', 'browse'.
 * @param name Name of the ad being shown. Ex: 'LevelComplete'.
 * @param beforeAd Callback before the ad is shown. Pause the game here.
 * @param afterAd Callback after the ad is shown.
 * @param adBreakDone Callback when the adBreak has completed. Resume the game here.
 * @param noShow Callback when the ad is timed out or not served. Resume the game here.
 */
export function showInterstitial(placement, name, beforeAd, afterAd, adBreakDone, noShow) {
    (window as any).triggerWortalAd(placement, name, {
        beforeAd: () => {
            console.log("[Wortal] BeforeAd");
            if (beforeAd) beforeAd();
        },
        afterAd: () => {
            console.log("[Wortal] AfterAd");
            if (afterAd) afterAd();
        },
        adBreakDone: () => {
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
        },
        noShow: () => {
            console.log("[Wortal] NoShow");
            if (noShow) noShow();
        },
    });
}

/**
 * Calls for rewarded ad.
 * @param name Name of the ad being shown. Ex: 'ReviveAndContinue'.
 * @param beforeAd Callback before the ad is shown. Pause the game here.
 * @param afterAd Callback after the ad is shown.
 * @param adBreakDone Callback when the adBreak has completed. Resume the game here.
 * @param beforeReward Callback before showing the rewarded ad. This can trigger a popup giving the player the option to view the ad for a reward.
 * @param adDismissed Callback when the player cancelled the rewarded ad before it finished. Do not reward the player.
 * @param adViewed Callback when the player viewed the rewarded ad successfully. Reward the player.
 * @param noShow Callback when the ad is timed out or not served. Resume the game here.
 */
export function showRewarded(name, beforeAd, afterAd, adBreakDone, beforeReward, adDismissed, adViewed, noShow) {
    (window as any).triggerWortalAd('reward', name, {
        beforeAd: () => {
            console.log("[Wortal] BeforeAd");
            if (beforeAd) beforeAd();
        },
        afterAd: () => {
            console.log("[Wortal] AfterAd");
            if (afterAd) afterAd();
        },
        adBreakDone: () => {
            console.log("[Wortal] AdBreakDone");
            if (adBreakDone) adBreakDone();
        },
        beforeReward: () => {
            console.log("[Wortal] BeforeReward");
            if (beforeReward) beforeReward();
        },
        adDismissed: () => {
            console.log("[Wortal] AdDismissed");
            if (adDismissed) adDismissed();
        },
        adViewed: () => {
            console.log("[Wortal] AdViewed");
            if (adViewed) adViewed();
        },
        noShow: () => {
            console.log("[Wortal] NoShow");
            if (noShow) noShow();
        },
    });
}
