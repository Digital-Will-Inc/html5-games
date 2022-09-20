/**
 * Helper script for integrating the Wortal SDK into games. Handles initialization for various platforms, and documents
 * the API with examples.
 *
 * Requires the index.html of the game to include the following div in the top of the body, <b>before the game canvas</b>:
 *
 * <pre>
 * <div class="loading-cover" id="loading-cover"
 *     style="background: #000; width: 100%; height: 100%; position: fixed; z-index: 100;">
 * </div>
 * </pre>
 *
 *  This is necessary to hide the game rendering while pre-roll ads are shown on certain platforms.
 *  You should not show the game canvas or play any audio until <code>hasPlayedPreroll == true</code>.
 *
 * @version 1.2.0
 */

const wortal = document.createElement('script');
wortal.src = 'https://html5gameportal.com/embeds/wortal-1.2.0.js';
wortal.type = 'text/javascript';
document.head.appendChild(wortal);

/**
 * Placement type needs to be one of the values as documented by Google.
 * See: https://developers.google.com/ad-placement/docs/placement-types
 */
const Placement = {
    /**
     * Your game has not loaded its UI and is not playing sound. There can only be one ‘preroll’ placement in your game
     * for each page load. Preroll ads can only use the adBreakDone callback.
     */
    PREROLL: 'preroll',
    /**
     * Your game has loaded, the UI is visible and sound is enabled, the player can interact with the game, but the
     * game play has not started yet.
     */
    START: 'start',
    /**
     * The player pauses the game.
     */
    PAUSE: 'pause',
    /**
     * The player navigates to the next level.
     */
    NEXT: 'next',
    /**
     * The player explores options outside of gameplay.
     */
    BROWSE: 'browse',
    /**
     * The player reaches a point in the game where they can be offered a reward.
     */
    REWARD: 'reward',
}

const onInitWortal = new Event('WortalAdLoaded');

let isWortalInit = false;
let hasPlayedPreroll = false;

let linkInterstitialId = "";
let linkRewardedId = "";

init();

function init() {
    window.addEventListener('load', () => {
        window.initWortal(function () {
            console.log('[Wortal] Setup complete.');
            const platform = window.getWortalPlatform();
            console.log('[Wortal] Platform: ' + platform);
            isWortalInit = true;
            if (platform === 'wortal') {
                showInterstitial(Placement.PREROLL, 'Preroll', {
                    adBreakDone: function () {
                        if (hasPlayedPreroll) {
                            return;
                        }
                        removeLoadingCover();
                        window.dispatchEvent(onInitWortal);
                        hasPlayedPreroll = true;
                    },
                    noShow: function () {
                        if (hasPlayedPreroll) {
                            return;
                        }
                        removeLoadingCover();
                        window.dispatchEvent(onInitWortal);
                        hasPlayedPreroll = true;
                    }
                });
            } else if (platform === 'link') {
                removeLoadingCover();
                window.wortalGame.initializeAsync().then(() => {
                    // Set your game's loading progress with wortalGame.setLoadingProgress(value); Range is 0 to 100.
                    // The game will not start unless the loading progress is set to 100.
                    window.wortalGame.startGameAsync();
                    getLinkAdUnitIds();
                    hasPlayedPreroll = true;
                });
            } else if (platform === 'viber') {
                removeLoadingCover();
                window.wortalGame.initializeAsync().then(() => {
                    // Set your game's loading progress with wortalGame.setLoadingProgress(value); Range is 0 to 100.
                    // The game will not start unless the loading progress is set to 100.
                    window.wortalGame.startGameAsync();
                    hasPlayedPreroll = true;
                });
            }
        });
    });
}

/**
 * Shows an interstitial ad.
 * @example
 * showInterstitial(Placement.NEXT, 'NextLevel', {
 *     beforeAd: function () {
 *        pauseGame();
 *     },
 *     afterAd: function () {
 *        resumeGame();
 *     },
 *     noShow: function () {
 *        resumeGame();
 *     }
 * });
 *
 * Callbacks object:
 *
 * <pre><code>
 * beforeAd: function () {}, // Called before the ad is shown. You should pause the game here.
 * afterAd: function () {}, // Called after the ad is shown. You should resume the game here.
 * adBreakDone: function () {}, // Callback when the adBreak has completed. Resume the game here. Only used on Platform.WORTAL
 * noShow: function () {} // Callback when the ad is timed out or not served. Resume the game here.
 *
 * @param {Placement} type Type of ad placement.
 * @param {string} description Description of the ad placement. Ex: "NextLevel"
 * @param {object} callbacks Object for callbacks.
 */
function showInterstitial(type, description, callbacks) {
    if (isWortalInit === false) {
        return;
    }
    if (type === Placement.REWARD) {
        return;
    }

    const params = {};
    if (callbacks.beforeAd) {
        params.beforeAd = callbacks.beforeAd;
    }
    if (callbacks.afterAd) {
        params.afterAd = callbacks.afterAd;
    }
    if (callbacks.noShow) {
        params.noShow = callbacks.noShow;
    }
    if (callbacks.adBreakDone) {
        params.adBreakDone = callbacks.adBreakDone;
    }

    window.triggerWortalAd(type, linkInterstitialId, description, params);
}

/**
 * Shows a rewarded ad.
 * @example
 * showRewarded('ReviveAndContinue', {
 *     beforeAd: function () {
 *        pauseGame();
 *     },
 *     afterAd: function () {
 *        resumeGame();
 *     },
 *     adDismissed: function () {
 *        gameOver();
 *     },
 *     adViewed: function () {
 *        reviveAndContinue();
 *     },
 *     noShow: function () {
 *        resumeGame();
 *     }
 * });
 *
 * Callbacks object:
 *
 * <pre><code>
 * beforeAd: function () {}, // Called before the ad is shown. You should pause the game here.
 * afterAd: function () {}, // Called after the ad is shown. You should resume the game here.
 * adBreakDone: function () {}, // Callback when the adBreak has completed. Resume the game here. Only used on Platform.WORTAL
 * beforeReward: function (showAdFn) {}, // Callback before showing the rewarded ad. This can trigger a popup giving the player the option to view the ad for a reward. Only used on Platform.WORTAL
 * adDismissed: function () {}, // Callback when the player cancelled the rewarded ad before it finished. Do not reward the player.
 * adViewed: function () {}, // Callback when the player viewed the rewarded ad successfully. Reward the player.
 * noShow: function () {} // Callback when the ad is timed out or not served. Resume the game here.
 *
 * @param {string} description Description of the ad placement. Ex: "NextLevel"
 * @param {object} callbacks Object for callbacks.
 */
function showRewarded(description, callbacks) {
    if (isWortalInit === false) {
        return;
    }

    const params = {};
    if (callbacks.beforeAd) {
        params.beforeAd = callbacks.beforeAd;
    }
    if (callbacks.afterAd) {
        params.afterAd = callbacks.afterAd;
    }
    if (callbacks.adDismissed) {
        params.adDismissed = callbacks.adDismissed;
    }
    if (callbacks.adViewed) {
        params.adViewed = callbacks.adViewed;
    }
    if (callbacks.beforeReward) {
        params.beforeReward = callbacks.beforeReward;
    }
    if (callbacks.noShow) {
        params.noShow = callbacks.noShow;
    }
    if (callbacks.adBreakDone) {
        params.adBreakDone = callbacks.adBreakDone;
    }

    window.triggerWortalAd(Placement.REWARD, linkRewardedId, description, params);
}

function removeLoadingCover() {
    document.getElementById('loading-cover').style.display = 'none';
}

function getLinkAdUnitIds() {
    wortalGame.getAdUnitsAsync().then((adUnits) => {
        console.log('Link AdUnit IDs returned: \n' + adUnits);
        linkInterstitialId = adUnits[0].id;
        linkRewardedId = adUnits[1].id;
    });
}