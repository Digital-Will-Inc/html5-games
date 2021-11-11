const fs = require('fs');
const archiver = require('archiver');

!fs.existsSync(`./dist/`) && fs.mkdirSync(`./dist/`);

const GAME_NAMES = [
    "ColorMatch",
    "emoji-minesweeper",
    "Flip-Card",
    "Simon-Says",
    "TowerBlocks"
]

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

        stream.on('close', () => {
            resolve();
            console.log(`${gameName} created with ` + archive.pointer() + ' total bytes');
        });

        stream.on('error', err => reject(err));
        archive.finalize();
    });
}


// const output = fs.createWriteStream(OUTPUT_DIR);

// output.on('close', function () {
//     console.log(archive.pointer() + ' total bytes');
//     console.log('archiver has been finalized and the output file descriptor has closed.');
// });


// archive.on('warning', function (err) {
//     if (err.code === 'ENOENT') {
//         // log warning
//     } else {
//         // throw error
//         throw err;
//     }
// });

// archive.on('error', function (err) {
//     throw err;
// });



// const folder1 = __dirname + "/ColorMatch" + "/build/";


// archive.directory(folder1, false);
// archive.pipe(output);
// archive.finalize();

