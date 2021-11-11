const fs = require("fs");
const path = require("path");
const GAME_NAMES = require("./GameNames");

const GAMES = GAME_NAMES;

// console.log("GAMES", GAMES.length);
CopyUtilsFileToGames();

function CopyUtilsFileToGames() {
    const utilsSource = "Utils";

    fs.readdirSync(utilsSource).forEach(itemName => {

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