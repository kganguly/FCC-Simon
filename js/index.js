var debug = true;
var play = true;

var Simon = (function () {
    function Simon() {
        var steps = []
        steps.totalSteps = 20;
        steps.generateSteps = function () {
            for (var i = 0; i < this.totalSteps; i++) {
                this.push(Math.floor(Math.random() * 4));
            }
        }

        function Button(color, litColor, audioSrc, el) {
            this.color = color;
            this.litColor = litColor;
            this.sound = new Sound(audioSrc);
            this.el = el;
        }


        Button.queue = [];
        Button.locked = false;
        Button.prototype.trigger = function (muted) {
            if (!muted) this.sound.play();
            this.el.css("background-color", this.litColor);
            // this.sound.onended = 

            var that = this;
            setTimeout(function () {
                console.log("COLOR: " + that.color);
                that.el.css("background-color", that.color);
                if (!isPlayerTurn) {
                    setTimeout(function () {
                        Button.queue.shift();
                        if (Button.queue.length > 0) Button.queue[0].trigger();
                        else {
                            Button.locked = false;
                            isPlayerTurn = true;
                        }
                    }, 500);
                }
            }, 1000);
        };
        Button.prototype.play = function () {
            Button.queue.push(this);
            if (Button.queue.length === 1) this.trigger();
        }
        Button.prototype.stop = function () {
            this.sound.pause();
            this.el.css("background-color", this.color);
        }

        var finalStage = 1;
        var currentStage = 1;
        var currentStep = 0;
        var isPlayerTurn = false;
        var buttonArray;
        var redButton;
        var greenButton;
        var blueButton;
        var yellowButton;

        function buildButtonArray() {
            buttonArray = [];
            greenButton = new Button("#39d14a", "white", "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", $(".green"));
            buttonArray.push(greenButton);
            redButton = new Button("red", "white", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", $(".red"));
            buttonArray.push(redButton);
            blueButton = new Button("#00a9ee", "white", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", $(".blue"));
            buttonArray.push(blueButton);
            yellowButton = new Button("yellow", "white", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3", $(".yellow"));
            buttonArray.push(yellowButton);
        }

        function sucess() {
            playAll();
            setTimeout(playAll, 1500);
            setTimeout(playAll, 3000);
        }

        function playAll() {
            for (var i = 0; i < buttonArray.length; i++) {
                buttonArray[i].trigger(true);
            }
        }

        this.isLocked = function () {
            return Button.locked;
        }

        this.press = function (index) {
            console.log("INDEX: " + index);
            if (index == steps[currentStep]) {
                buttonArray[index].trigger();
                currentStep++;
                if (currentStep === finalStage) {
                    setTimeout(sucess, 2000);
                } else if (currentStep === currentStage) {
                    currentStage++;
                    currentStep = 0;
                    setTimeout(this.playSteps, 2000);
                }
            } else {
                currentStep = 0;
                setTimeout(this.playSteps, 2000);
            }
        }

        this.playSteps = function () {
            Button.locked = true;
            isPlayerTurn = false;
            for (var i = 0; i < currentStage; i++) {
                var button = buttonArray[steps[i]];
                button.play();
            }
        }
        this.start = function () {
            buildButtonArray();
            console.log("buttonArray: " + buttonArray);
            steps.generateSteps();
            console.log("steps: " + steps);
            setTimeout(this.playSteps, 1000);
        }
    }

    function Sound(src) {
        try {
            this.sound = document.createElement("audio");
            this.src = src;
            /*Move this to mobile audio click listener */
            this.sound.src = this.src;
            this.sound.setAttribute("preload", "auto");
            this.sound.setAttribute("controls", "none");
            this.sound.style.display = "none";
            document.body.appendChild(this.sound);
            this.play = function () {
                this.sound.play();
            }
            this.stop = function () {
                this.sound.pause();
            }
        } catch (err) {
            console.log(err);
        }
    }

    var instance;
    return {
        getInstance: function () {
            if (instance === undefined) {
                instance = new Simon();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };

})();

var game = Simon.getInstance();

$(document).ready(function () {
    setListeners();

});

function setListeners() {
    $(".inner-circle").click(function () {
        if (!game.isLocked())
            game.start();
    });
    $(".corner").click(function () {
        if (!game.isLocked())
            game.press(this.getAttribute("index"));
    });
}