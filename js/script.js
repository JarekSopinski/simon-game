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
const stepsToWin = 20;

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

const sounds = {

    green: document.getElementById("soundGreen"),
    red: document.getElementById("soundRed"),
    yellow: document.getElementById("soundYellow"),
    blue: document.getElementById("soundBlue"),
    error: document.getElementById("soundError")
    // for some reason .play() doesn't work with jQuery selectors

};

let timeoutForPlayerTimeLimit;
let timeoutForStartOfComputerTurn;
let timeoutForStartShowingStep;
let timeoutForEndShowingStep;

const initialCounterText = "--";
const errorCounterText = "!!!";
const correctCounterText = "OK";
const gameOverCounterText = "WIN!";
const noPowerMessage = "There is no power. Turn on power first!";


//********* COMPUTER'S TURN *********//


const executeComputerTurn = (typeOfTurn) => {

    state.turn = "computer";

    if (typeOfTurn === "newTurn") {
        addNewStep();
        state.stepCounter++
    }

    $counterValue.text(state.stepCounter);

    for (let stepIndex = 0; stepIndex < state.computerSteps.length; stepIndex++) {

        let delayMultiplier = stepIndex + 1;
        timeoutForStartShowingStep = setTimeout(() => startShowingStep(stepIndex), 2000 * delayMultiplier)

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

    sounds[step].load();
    sounds[step].play();

    timeoutForEndShowingStep = setTimeout(() => endShowingStep(stepIndex), 1000)

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


//********* PLAYER'S TURN *********//


const startPlayerTurn = () => {

    console.log("playerTurnStarts");
    state.turn = "player";
    state.playerSteps = []; // has to be cleared for next turn!

    // player has to repeat all steps in a limited time:
    timeoutForPlayerTimeLimit = setTimeout(handlePlayerTimeLimitEnd, 1000 * state.playerTimeLimit)


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

    const isPlayerCorrect = compareSteps();
    let hasPlayerRepeatedAllSteps;

    state.playerSteps.length === state.computerSteps.length ?
        hasPlayerRepeatedAllSteps = true
        :
        hasPlayerRepeatedAllSteps = false;

    if (!isPlayerCorrect) { handlePlayerMistake() }
    else if (isPlayerCorrect && hasPlayerRepeatedAllSteps) { handlePlayerSuccess() }

};

const compareSteps = () => {

    const computerSteps = state.computerSteps;
    const playerSteps = state.playerSteps;

    const computerStepsUpToPlayerLastStep = computerSteps.slice(0, playerSteps.length);

    return JSON.stringify(computerStepsUpToPlayerLastStep) === JSON.stringify(playerSteps)

};

const handlePlayerMistake = () => {

    sounds.error.load();
    sounds.error.play();

    $counterValue.text(errorCounterText);
    clearTimeout(timeoutForPlayerTimeLimit);
    timeoutForStartOfComputerTurn = setTimeout(() => executeComputerTurn("repeat"), 2000)

};

const handlePlayerSuccess = () => {

    console.log("correct!");

    $counterValue.text(correctCounterText);
    clearTimeout(timeoutForPlayerTimeLimit);

    if (state.stepCounter < stepsToWin) {

        state.playerTimeLimit += 2; // time limit rises along with number of steps, 2 sec. for each new step
        timeoutForStartOfComputerTurn = setTimeout(() => executeComputerTurn("newTurn"), 2000)

    } else { handleGameOverAndRestart() }

};

const handlePlayerTimeLimitEnd = () => {

    sounds.error.load();
    sounds.error.play();

    $counterValue.text(errorCounterText);
    timeoutForStartOfComputerTurn = setTimeout(() => executeComputerTurn("repeat"), 2000)

};


//********* MISC. FUNCTIONS *********//

const handleGameOverAndRestart = () => {

    const wasLastGameStrict = state.isStrictModeOn;

    $counterValue.text(gameOverCounterText);
    clearAllTimeouts();
    setInitialState();

    state.isPowerOn = true;
    state.isGameRunning = true;
    state.isStrictModeOn = wasLastGameStrict;

    timeoutForStartOfComputerTurn = setTimeout(() => executeComputerTurn("newTurn"), 2000)

};


const clearAllTimeouts = () => {

    clearTimeout(timeoutForStartShowingStep);
    clearTimeout(timeoutForEndShowingStep);
    clearTimeout(timeoutForPlayerTimeLimit);
    clearTimeout(timeoutForStartOfComputerTurn)

};

const setInitialState = () => state = $.extend(true, {}, initialState);


//********* EVENT HANDLERS & LISTENERS *********//


const togglePower = () => {

    switch (state.isPowerOn) {

        case false:
            state.isPowerOn = true;
            $btnPowerOff.css("background-color", initialColors.black);
            $btnPowerOn.css("background-color", initialColors.blue);
            $counterValue.text(initialCounterText);
            break;

        case true:
            clearAllTimeouts();
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

    sounds[step].load();
    sounds[step].play();

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