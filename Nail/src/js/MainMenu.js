MyGame.MainMenu = function (game) {};
MyGame.MainMenu.prototype = {
    create: function () {
        game.stage.backgroundColor = '#d4d8d3';
        GameUI.Game_element();

        const instruction = function () {
            if (browserLanguage === "ja") {
                return "釘を触らないで";
            } else {
                return "Don't touch the nail";
            }
        }();

        this.GameTitle = this.add.text(this.world.centerX, 250, instruction, {
            font: "80px Microsoft YaHei",
            fill: '#808080',
            align: 'center'
        });
        this.GameTitle.anchor.set(0.5);

        //添加屏幕中间的圆
        this.circle = game.add.sprite(game.world.centerX, game.world.centerY, game.circleGraphics.generateTexture());
        this.circle.anchor.set(0.5);

        const tutorialText = function () {
            if (browserLanguage === "ja") {
                return "スクリーンをタップしてジャンプ";
            } else {
                return "Tap the screen to jump";
            }
        }();

        this.depictText = this.add.text(this.world.centerX, 710, tutorialText, {
            font: "30px Microsoft YaHei",
            fill: '#fc3463',
            align: 'center'
        });
        this.depictText.anchor.set(0.5);

        //添加上下矩形
        this.rectTop = game.add.sprite(0, 0, game.rectGraphics.generateTexture());
        this.rectBottom = game.add.sprite(0, game.world.height - 80, game.rectGraphics.generateTexture());

        //添加小鸟
        this.bird = this.add.sprite(game.world.centerX, game.world.centerY, 'bird');
        this.bird.anchor.set(0.5);

        game.input.onTap.addOnce(function () {
            this.state.start('Game')
        }, this);

        //销毁 图形
        game.circleGraphics.destroy();
        game.NailGraphics.destroy();
        game.rectGraphics.destroy();
    }
};

