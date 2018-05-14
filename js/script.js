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
    playerTimeLimit: 5
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
let checkAtTimeLimit; // saves checkIfPlayerIsCorrect timeout

const initialCounterText = "--";
const errorCounterText = "!!!";
const noPowerMessage = "There is no power. Turn on power first!";


//********* GAME MECHANICS *********//


const executeComputerTurn = (typeOfTurn) => {

    state.turn = "computer";

    if (typeOfTurn === "newTurn") {
        addNewStep();
        state.stepCounter++
    }

    $counterValue.text(state.stepCounter);

    for (let stepIndex = 0; stepIndex < state.computerSteps.length; stepIndex++) {

        let delayMultiplier = stepIndex + 1;
        setTimeout(() => startShowingStep(stepIndex), 2000 * delayMultiplier)

    }

};

const addNewStep = () => {

    const randomStep = steps[Math.floor(Math.random() * steps.length)];
    state.computerSteps.push(randomStep)

};

const startShowingStep = (stepIndex) => {

    console.log("start: " + state.computerSteps[stepIndex]);

    const step = state.computerSteps[stepIndex];
    const activeColor = activeColors[step];
    $stepButtons[step].css("background-color", activeColor);

    setTimeout(() => endShowingStep(stepIndex), 1000)

};

const endShowingStep = (stepIndex) => {

    console.log("end: " + state.computerSteps[stepIndex]);

    const step = state.computerSteps[stepIndex];
    const initialColor = initialColors[step];
    $stepButtons[step].css("background-color", initialColor);

    if (stepIndex === (state.computerSteps.length - 1)) {
        startPlayerTurn()
    }

};

const startPlayerTurn = () => {

    console.log("playerTurnStarts");
    state.turn = "player";
    state.playerSteps = []; // has to be cleared for next turn!
    state.playerTimeLimit += 2; // time limit rises along with number of steps, 2 sec. for each new step

    // player has to repeat all steps in a limited time:
    checkAtTimeLimit = setTimeout(checkIfPlayerIsCorrect, 1000 * state.playerTimeLimit)


};

const executePlayerMove = (step) => {

    state.playerSteps.push(step);
    showStepClickedByPlayer(step);
    checkIfPlayerIsCorrect()

};

const showStepClickedByPlayer = (step) => {

    const activeColor = activeColors[step];
    const initialColor = initialColors[step];

    $stepButtons[step].css("background-color", activeColor);

    setTimeout(() => {
        $stepButtons[step].css("background-color", initialColor)
    }, 500)

};

const checkIfPlayerIsCorrect = () => {

    // runs after every player's click and after time limit has expired

    const isPlayerCorrect = compareArrays(state.computerSteps, state.playerSteps);
    let hasPlayerRepeatedAllSteps;

    state.playerSteps.length === state.computerSteps.length ?
        hasPlayerRepeatedAllSteps = true
        :
        hasPlayerRepeatedAllSteps = false;

    if (!isPlayerCorrect) {
        $counterValue.text(errorCounterText);
        clearTimeout(checkAtTimeLimit);
        setTimeout(() => executeComputerTurn("repeat"), 2000) }

    else if (isPlayerCorrect && hasPlayerRepeatedAllSteps) {
        console.log("correct!");
        clearTimeout(checkAtTimeLimit);
        setTimeout(() => executeComputerTurn("newTurn"), 2000)
    }

};


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
        executeComputerTurn("newTurn")

    } else if (!state.isPowerOn) { alert(noPowerMessage) }

};

const handlePlayerClick = (step) => {

    if (state.isGameRunning && state.turn === "player") {
        executePlayerMove(step)
    }

};

$(document).ready(() => {

    setInitialState();

    $btnTogglePower.on("click", togglePower);
    $btnStart.on("click", startGame);
    $btnStrict.on("click", toggleStrictMode);

    steps.forEach(step => $stepButtons[step].on("click", () => handlePlayerClick(step)))

});