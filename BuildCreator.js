const GAME_NAMES = require("./GameNames");
const fs = require('fs');
const archiver = require('archiver');

!fs.existsSync(`./dist/`) && fs.mkdirSync(`./dist/`);

for (let i = 0; i < GAME_NAMES.length; i++) {
    const gameName = GAME_NAMES[i];

    const GAME_DIR = `${__dirname}/${gameName}/build`;
    const OUTPUT_DIR = `${__dirname}/dist/${gameName}.zip`;

    zipDirectory(GAME_DIR, OUTPUT_DIR, gameName)
}



function zipDirectory(source, out, gameName) {
    const archive = archiver('zip');
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('error', err => reject(err));
        archive.finalize();
    });
}