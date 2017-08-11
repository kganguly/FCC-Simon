var debug = true;
var play = true;

var Simon = (function () {
    function Simon() {
        var steps = []
        steps.generateSteps = function () {
            this.length = 0;
            for (var i = 0; i < finalStage; i++) {
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
        Button.failSound = new Sound("media/Buzz-SoundBible.com-1790490578.mp3");
        Button.prototype.trigger = function (muted) {
            if (!power) return;
            if (!muted) this.sound.play();
            this.el.css("background-color", this.litColor);

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
            }, 500);
        };
        Button.prototype.fail = function () {
            if (!power) return;
            Button.failSound.play();
            this.el.css("background-color", this.litColor);

            var that = this;
            setTimeout(function () {
                console.log("COLOR: " + that.color);
                that.el.css("background-color", that.color);
                Button.failSound.stop();
            }, 500);
        };
        Button.prototype.play = function () {
            if (!power) return;
            Button.queue.push(this);
            if (Button.queue.length === 1) this.trigger();
        }


        var power = false;
        var finalStage = 2;
        var currentStage = 0;
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

        function success() {
            if (!power) return;
            playAll();
            setTimeout(playAll, 1000);
            setTimeout(playAll, 2000);
            setTimeout(game.start, 3000);
        }

        function playAll() {
            if (!power) return;
            for (var i = 0; i < buttonArray.length; i++) {
                buttonArray[i].trigger(true);
            }
        }

        function nextStage() {
            if (!power) return;
            currentStage++;
            console.log("Next Stage: " + currentStage);
            document.querySelector("#count").textContent = currentStage > 9 ? currentStage : "0" + currentStage;
        }

        function reset() {
            if (!power) return;
            currentStage = 0;
            currentStep = 0;
            isPlayerTurn = false;
            document.querySelector("#count").textContent = "--";
        }

        function playSteps() {
            if (!power) return;
            console.log("Current Stage: " + currentStage);
            Button.locked = true;
            isPlayerTurn = false;
            for (var i = 0; i < currentStage; i++) {
                buttonArray[steps[i]].play();
                console.log("PLAY: " + steps[i]);
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
                    setTimeout(success, 2000);

                } else if (currentStep === currentStage) {
                    setTimeout(nextStage, 1500);
                    currentStep = 0;
                    setTimeout(playSteps, 2000);
                }
            } else {
                buttonArray[index].fail();
                currentStep = 0;
                setTimeout(playSteps, 2000);
            }
        }

        this.start = function () {
            reset();
            if (!buttonArray) buildButtonArray();
            console.log("buttonArray: " + buttonArray);
            steps.generateSteps();
            console.log("steps: " + steps);
            setTimeout(nextStage, 500);
            setTimeout(playSteps, 1000);
        }
        this.togglePower = function () {
            power = power ? false : true;
            document.querySelector("#slider").style.float = power ? "right" : "left";
            document.querySelector("#count").textContent = power ? "--" : "";
        }
        this.isOn = function () {
            return power;
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
    document.querySelector("#switch").addEventListener("click", function () {
        game.togglePower();

    });
    $("#start button").click(function () {
        if (!game.isLocked() && game.isOn())
            game.start();
    });
    $(".corner").click(function () {
        if (!game.isLocked() && game.isOn())
            game.press(this.getAttribute("index"));
    });
}