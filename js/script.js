const $btnGreen = $("#btnGreen");
const $btnRed = $("#btnRed");
const $btnYellow = $("#btnYellow");
const $btnBlue = $("#btnBlue");
const $counterValue = $("#counterValue");
const $btnStart = $("#btnStart");
const $btnStrict = $("#btnStrict");
const $strictDiode = $("#strictDiode");
const $btnTogglePower = $("#btnTogglePower");
const $btnPowerOff = $("#btnPowerOff");
const $btnPowerOn = $("#btnPowerOn");

let state = {};

const initialState = {
    isPowerOn: false,
    isGameRunning: false,
    isStrictModeOn: false,
    turn: null,
    step: 0,
    computerCombo: [],
    playerCombo: [],
    playerTimeLimit: 5000 // increased by 1000 or 2000 every step
};

const colors = {
    greenActive: "#7FB800",
    greenNotActive: "#248232",
    redActive: "#EF233C",
    redNotActive: "#D90429",
    yellowActive: "#F5CB5C",
    yellowNotActive: "#FFB400",
    blueActive: "#00A6ED",
    blueNotActive: "#006BA6",
    black: "#1B1B1E"
};

const stepsToWin = 20;
const exampleTime = 2000;

const initialCounterText = "--";
const errorCounterText = "!!";
const noPowerMessage = "There is no power. Turn on power first!";


//********* GAME MECHANICS *********//


const exectueComputerTurn = () => {};

const executePlayerTurn = () => {};


//********* HELPER FUNCTIONS *********//


const compareArrays = (array1, array2) => {
    return JSON.stringify(array1) === JSON.stringify(array2)
};

const setInitialState = () => state = $.extend(true, {}, initialState);


//********* EVENT HANDLERS *********//


const togglePower = () => {

    switch (state.isPowerOn) {

        case false:
            state.isPowerOn = true;
            $btnPowerOff.css("background-color", colors.black);
            $btnPowerOn.css("background-color", colors.blueNotActive);
            $counterValue.text(initialCounterText);
            break;

        case true:
            setInitialState();
            $btnPowerOff.css("background-color", colors.blueNotActive);
            $btnPowerOn.css("background-color", colors.black);
            $strictDiode.css("background-color", colors.black);
            $counterValue.empty();

    }

};

const toggleStrictMode = () => {

    if (state.isPowerOn) {

        switch (state.isStrictModeOn) {

            case false:
                state.isStrictModeOn = true;
                $strictDiode.css("background-color", colors.redNotActive);
                break;

            case true:
                state.isStrictModeOn = false;
                $strictDiode.css("background-color", colors.black)

        }

    } else { alert(noPowerMessage) }

};

const startGame = () => {

    if (state.isPowerOn && !state.isGameRunning) {

        state.isGameRunning = true;
        $counterValue.text(state.step + 1);
        exectueComputerTurn()

    } else if (!state.isPowerOn) { alert(noPowerMessage) }

};

$(document).ready(() => {

    setInitialState();

    $btnTogglePower.on("click", togglePower);
    $btnStart.on("click", startGame);
    $btnStrict.on("click", toggleStrictMode)

});