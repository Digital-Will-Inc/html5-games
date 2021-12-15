const fs = require("fs");
const path = require("path");
const GAME_NAMES = require("./GameNames");

const GAMES = GAME_NAMES;

// console.log("GAMES", GAMES.length);
CopyUtilsFileToGames();

function CopyUtilsFileToGames() {
    const utilsSource = "Utils";

    let files = fs.readdirSync(utilsSource);

    //NOTE: Temp disable localeHandle because not all projects needs this script
    files = files.filter(fileName => fileName !== "LocaleHandler.js");

    files.forEach(itemName => {

        const sourcePath = path.join(utilsSource, itemName);

        for (let i = 0; i < GAMES.length; i++) {
            const game = GAMES[i];
            const targetPath = path.join(`${game}/build/`, itemName);

            if (fs.existsSync(targetPath) == false) {
                console.warn(targetPath + "path doesn't exist");
            } else {
                console.log("Copied " + sourcePath + " to target: " + targetPath);
            }

            fs.copyFileSync(sourcePath, targetPath);
        }
    });

    console.log("Done.")
}