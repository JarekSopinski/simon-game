const $stepButtons = {
    green: $("#btnGreen"),
    red: $("#btnRed"),
    yellow: $("#btnYellow"),
    blue: $("#btnBlue")
};

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
    stepCounter: 0,
    computerSteps: [],
    playerSteps: [],
    playerTimeLimit: 5000 // increased by 1000 or 2000 every step
};

const steps = ["green", "red", "yellow", "blue"];

const initialColors = {

    green: "#248232",
    red: "#D90429",
    yellow: "#FFB400",
    blue: "#006BA6",
    black: "#1B1B1E"

};

const activeColors = {

    green: "#7FB800",
    red: "#EF233C",
    yellow: "#F5CB5C",
    blue: "#00A6ED"

};

const stepsToWin = 20;
const exampleTime = 2000;

const initialCounterText = "--";
const errorCounterText = "!!";
const noPowerMessage = "There is no power. Turn on power first!";


//********* GAME MECHANICS *********//


const executeComputerTurn = () => {

    state.turn = "computer";
    addNewStep();
    state.computerSteps.forEach(step => displayStep(step))

};

const addNewStep = () => {

    const randomStep = steps[Math.floor(Math.random() * steps.length)];
    state.computerSteps.push(randomStep)

};

const displayStep = (step) => {



};

const startDisplayingStep = (step) => {

    //$stepButtons[step]

};

const endDisplayingStep = (step) => {


};

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
            $btnPowerOff.css("background-color", initialColors.black);
            $btnPowerOn.css("background-color", initialColors.blue);
            $counterValue.text(initialCounterText);
            break;

        case true:
            setInitialState();
            $btnPowerOff.css("background-color", initialColors.blue);
            $btnPowerOn.css("background-color", initialColors.black);
            $strictDiode.css("background-color", initialColors.black);
            $counterValue.empty();

    }

};

const toggleStrictMode = () => {

    if (state.isPowerOn) {

        switch (state.isStrictModeOn) {

            case false:
                state.isStrictModeOn = true;
                $strictDiode.css("background-color", initialColors.red);
                break;

            case true:
                state.isStrictModeOn = false;
                $strictDiode.css("background-color", initialColors.black)

        }

    } else { alert(noPowerMessage) }

};

const startGame = () => {

    if (state.isPowerOn && !state.isGameRunning) {

        state.isGameRunning = true;
        $counterValue.text(state.stepCounter + 1);
        executeComputerTurn()

    } else if (!state.isPowerOn) { alert(noPowerMessage) }

};

$(document).ready(() => {

    setInitialState();

    $btnTogglePower.on("click", togglePower);
    $btnStart.on("click", startGame);
    $btnStrict.on("click", toggleStrictMode)

});