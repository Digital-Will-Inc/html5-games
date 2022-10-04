/**
 * Wortal SDK for HTML5 games.
 * Handles initialization for various platforms, and add an analytics API.
 *
 * Requires the index.html of the game to include the following div in the body:
 *
 * <pre>
 * <div class="loading-cover" id="loading-cover" style="background: #000; width: 100%; height: 100%; position: fixed; z-index: 100;"></div>
 * </pre>
 *
 *  This is necessary to hide the game rendering while pre-roll ads are shown on certain platforms.
 *  You should not show the game canvas or play any audio until <code>hasPlayedPreroll == true</code>.
 *
 * @version 1.3.2
 */

const GAME_NAME = "Circle Ninja";

const wortal = document.createElement('script');
wortal.src = 'https://html5gameportal.com/embeds/wortal-1.2.0.js';
wortal.type = 'text/javascript';
document.head.appendChild(wortal);

/**
 * Placement type needs to be one of the values as documented by Google.
 * @see https://developers.google.com/ad-placement/docs/placement-types
 */
const Placement = {
    /// Your game has not loaded its UI and is not playing sound. There can only be one ‘preroll’ placement in your game
    /// for each page load. Preroll ads can only use the adBreakDone callback.
    PREROLL: 'preroll',
    /// Your game has loaded, the UI is visible and sound is enabled, the player can interact with the game, but the
    /// game play has not started yet.
    START: 'start',
    /// The player pauses the game.
    PAUSE: 'pause',
    ///  The player navigates to the next level.
    NEXT: 'next',
    /// The player explores options outside of gameplay.
    BROWSE: 'browse',
    /// The player reaches a point in the game where they can be offered a reward.
    REWARD: 'reward',
}

const onInitWortal = new Event('WortalLoaded');

let isWortalInit = false;
let isAdBlocked = false;

let hasPlayedPreroll = false;
let linkInterstitialId = "";
let linkRewardedId = "";

let gameTimer = 0;
let levelTimer = 0;
let levelTimerHandle;
let levelName = "";

_initWortalSdk();

function _initWortalSdk() {
    if (isWortalInit) return;
    window.addEventListener('load', () => {
        window.initWortal(function () {
            console.log('[Wortal] Initializing..');
            const platform = window.getWortalPlatform();
            console.log('[Wortal] Platform: ' + platform);
            isWortalInit = true;
            if (platform === 'wortal') {
                showInterstitial(Placement.PREROLL, 'Preroll', {
                    afterAd: function () {
                        if (hasPlayedPreroll) return;
                        _removeLoadingCover();
                        window.dispatchEvent(onInitWortal);
                        hasPlayedPreroll = true;
                    }
                });
            } else if (platform === 'link') {
                _removeLoadingCover();
                if (window.wortalGame) {
                    window.wortalGame.initializeAsync().then(() => {
                        // Set your game's loading progress with wortalGame.setLoadingProgress(value); Range is 0 to 100.
                        // The game will not start unless the loading progress is set to 100.
                        window.wortalGame.startGameAsync();
                        _getLinkAdUnitIds();
                        hasPlayedPreroll = true;
                    });
                }
            } else if (platform === 'viber') {
                _removeLoadingCover();
                if (window.wortalGame) {
                    window.wortalGame.initializeAsync().then(() => {
                        // Set your game's loading progress with wortalGame.setLoadingProgress(value); Range is 0 to 100.
                        // The game will not start unless the loading progress is set to 100.
                        window.wortalGame.startGameAsync();
                        hasPlayedPreroll = true;
                    });
                }
            }
        }, function () {
            console.log("[Wortal] Ad blocker detected.");
            _removeLoadingCover();
            isAdBlocked = true;
        });

        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "hidden") {
                _logGameEnd();
            }
        });

        _getIntlData()
            .then(response => _logGameStart(response))
            .catch(() => _logGameStart("Nulltherlands"));

        console.log("[Wortal] Initialized");
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
 * });
 *
 * @param {Placement} placement Type of ad placement.
 * @param {string} description Description of the ad placement. Ex: "NextLevel"
 * @param {object} callbacks Object for callbacks. See the example above for definition.
 */
function showInterstitial(placement, description, callbacks) {
    if (isWortalInit === false) return;
    if (placement === Placement.REWARD) return;
    if (placement === Placement.PREROLL && hasPlayedPreroll) return;
    if (isAdBlocked) {
        callbacks.afterAd();
        return;
    }

    const params = {};
    if (callbacks.beforeAd) {
        params.beforeAd = callbacks.beforeAd;
    }
    // We should always receive only one of the following callbacks: afterAd, noShow or noBreak.
    // They all signal that the ad event is complete and that we should resume the game now.
    if (callbacks.afterAd) {
        params.afterAd = callbacks.afterAd;
        params.noShow = callbacks.afterAd;
        params.noBreak = callbacks.afterAd;
    }
    // Preroll ads only return adBreakDone and/or noShow.
    if (placement === Placement.PREROLL) {
        params.adBreakDone = callbacks.afterAd;
    }

    window.triggerWortalAd(placement, linkInterstitialId, description, params);
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
 * });
 *
 * @param {string} description Description of the ad placement. Ex: "NextLevel"
 * @param {object} callbacks Object for callbacks. See the example above for definition.
 */
function showRewarded(description, callbacks) {
    if (isWortalInit === false) return;
    if (isAdBlocked) {
        callbacks.afterAd();
        return;
    }

    const params = {};
    if (callbacks.beforeAd) {
        params.beforeAd = callbacks.beforeAd;
    }
    // We should always receive only one of the following callbacks: afterAd, noShow or noBreak.
    // They all signal that the ad event is complete and that we should resume the game now.
    if (callbacks.afterAd) {
        params.afterAd = callbacks.afterAd;
        params.noShow = callbacks.afterAd;
        params.noBreak = callbacks.afterAd;
    }
    if (callbacks.adDismissed) {
        params.adDismissed = callbacks.adDismissed;
    }
    if (callbacks.adViewed) {
        params.adViewed = callbacks.adViewed;
    }
    // This is only called on AdSense, we need to call showAdFn() here to trigger the ad to show.
    params.beforeReward = function (showAdFn) { showAdFn() };

    window.triggerWortalAd(Placement.REWARD, linkRewardedId, description, params);
}

/**
 * Logs an event when the player begins the tutorial. Starts a timer that tracks how long the player spends in this
 * level. Call logTutorialEnd() to get the value of the timer in the event.
 */
function logTutorialStart() {
    logLevelStart("Tutorial");
}

/**
 * Logs an event when the player finishes the tutorial. This can be used to determine how many players complete
 * the tutorial vs skipping.
 */
function logTutorialEnd() {
    logLevelEnd("Tutorial");
}

/**
 * Logs an event for the player starting a level. This will trigger a level timer with the given level name. If
 * logLevelEnd() is called with the same level name, it will record the time it took the player to finish the level.
 * @param level {string} Level the player started.
 * @return {number} ID of the timer being used to track the level time.
 */
function logLevelStart(level) {
    if (levelTimerHandle != null) {
        clearInterval(levelTimerHandle);
        levelTimerHandle = null;
    }
    levelName = level;
    levelTimer = 0;
    levelTimerHandle = setInterval(() => levelTimer += 1, 1000);
    _logEvent("LevelStart", {
        game: GAME_NAME,
        level: level,
    });
}

/**
 * Logs an event for the player ending a level. Also logs how long it took the player to complete the level if
 * logLevelStart() was called before this with the same level variable.
 * @param level {string} Level the player played.
 * @param score {string} Score the player achieved in the level.
 * @param wasCompleted {boolean} Did the player complete the level or not.
 */
function logLevelEnd(level, score = '0', wasCompleted = true) {
    if (levelTimerHandle != null) {
        clearInterval(levelTimerHandle);
        levelTimerHandle = null;
    }
    if (levelName !== level) {
        levelTimer = 0;
    }
    _logEvent("LevelEnd", {
        game: GAME_NAME,
        level: level,
        time: levelTimer,
        score: score,
        complete: wasCompleted,
    });
    levelTimer = 0;
}

/**
 * Logs an event when the player levels up.
 * @param level {string} Level the player achieved.
 */
function logLevelUp(level) {
    _logEvent("LevelUp", {
        game: GAME_NAME,
        level: level,
    });
}

/**
 * Logs the players score. This can be used to record a high score or track scores across different points in the
 * game to determine difficulty level or imbalances.
 * @param {string} score Score the player achieved.
 */
function logScore(score) {
    _logEvent("PostScore", {
        game: GAME_NAME,
        score: score,
    });
}

/**
 * Logs a choice the player makes in the game. This can be useful for determining which characters are more
 * popular, which paths are more commonly taken, etc. This can be a powerful tool for balancing the game and
 * giving the players more of what they enjoy.
 * @param {string} decision Decision the player was faced with. Ex: Character
 * @param {string} choice Choice the player made. Ex: Blue Dog
 */
function logGameChoice(decision, choice) {
    _logEvent("GameChoice", {
        game: GAME_NAME,
        decision: decision,
        choice: choice,
    });
}

// This is automatically called when the Wortal SDK is initialized. It should not be called by the game.
function _logGameStart(country) {
    const platform = window.getWortalPlatform();
    const browser = navigator.userAgent;
    _logEvent("GameStart", {
        game: GAME_NAME,
        platform: platform,
        browser: browser,
        country: country,
    });
    setInterval(function () {
        if (document.visibilityState !== "hidden") {
            gameTimer += 1;
        }
    }, 1000);
}

// This is automatically called when the browser is closed. It should not be called by the game.
function _logGameEnd() {
    _logEvent("GameEnd", {
        game: GAME_NAME,
        timePlayed: gameTimer,
    });
}

// This should not be directly called, instead use the event functions that correspond to the event
// you want to report.
function _logEvent(name, features) {
    let request = new XMLHttpRequest();
    request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({ name, features }));
}

function _getIntlData() {
    return fetch('./intl-data.json')
        .then(response => response.json())
        .then(data => _getPlayerCountry(data))
        .catch(error => console.log(error));
}

// This uses the time zone setting of the player to determine their country.
// We do this to avoid collecting any personal data on the player for GDPR compliance.
// The location is very coarse and easily spoofed so nothing here can identify the player.
function _getPlayerCountry(data) {
    if (data == null) {
        return "Nulltherlands";
    }
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const arr = zone.split("/");
    const city = arr[arr.length - 1];
    return data[city];
}

function _removeLoadingCover() {
    document.getElementById('loading-cover').style.display = 'none';
}

function _getLinkAdUnitIds() {
    wortalGame.getAdUnitsAsync().then((adUnits) => {
        console.log('[Wortal] Link AdUnit IDs returned: \n' + adUnits);
        linkInterstitialId = adUnits[0].id;
        linkRewardedId = adUnits[1].id;
    });
}
