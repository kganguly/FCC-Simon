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
        Button.prototype.trigger = function () {
            this.sound.play();
            this.el.css("background-color", this.litColor);
            // this.sound.onended = 

            var that = this;
            setTimeout(function () {
                console.log("COLOR: " + that.color);
                that.el.css("background-color", that.color);
                setTimeout(function () {
                    Button.queue.shift();
                    if (Button.queue.length > 0) Button.queue[0].trigger();
                }, 500);
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

        var currentStep = 9;
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

        this.playSteps = function () {
            for (var i = 0; i < currentStep; i++) {
                var button = buttonArray[steps[i]];
                button.play();
            }
        }
        this.start = function () {
            buildButtonArray();
            console.log("buttonArray: " + buttonArray);
            steps.generateSteps();
            console.log("steps: " + steps);
            currentStep++;
            setTimeout(this.playSteps, 1000);
        }
    }

    function Sound(src) {
        try {
            this.sound = document.createElement("audio");
            this.src = src;
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
    console.log("Listeners");
    $(".inner-circle").click(function () {
        console.log("CLICK");
        game.start();
    });
}