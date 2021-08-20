//Flags and size limit
let initialized = false;
let operatorInUse = false;
let backspaceFlag = true;
const roundFactor = 10000000000000;
const calculatorUpperLimit = 99999999999999;

//Basic Operations
function add(a, b){
    return Number(a) + Number(b);
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if (b == 0){
        return 'Nice try'
    }
    return a / b;
}

//Compute basic operations
function operate(operator, a, b){
    switch(operator){
        case '+':
            return add(a, b);
        case '-':
            return subtract(a,b);
        case '*':
            return multiply(a,b);
        case '/': 
            return divide(a, b);
        default:
            return 0;
    }
}

const display = document.querySelector('.display');
const digits = document.querySelectorAll(".digit");

//Check if the user has begun using the calculator and erase the default display
function checkInitialized(){
    if (!initialized){
        initialized = true;
        display.textContent = '';
    }
}

//Check if the user has previously used an operator and allow the user to backspace if so
function checkPrevOperator() {
    if (operatorInUse){
        operatorInUse = false;
        backspaceFlag = true;
        return true;
    }
    return false;
}

//DIGITS
//Holds previous and current numbers for operation
let numCache = {
    prevNum: 0,
    curNum: 0,
};

//Display the digit the user pressed depending on whether a previous operator is stored and if the display is under the size limit
function displayDigit(currentDisplay){
    checkInitialized();
    if (checkPrevOperator()){
        numCache.prevNum = numCache.curNum;
        numCache.curNum = currentDisplay;
        display.textContent = numCache.curNum;
    }
    else if (display.textContent.length <= String(calculatorUpperLimit).length){
        numCache.curNum += currentDisplay;
        display.textContent += currentDisplay;
    }
    console.table(numCache);
}

digits.forEach((digit) => {
    digit.addEventListener('click', function(e){
        displayDigit(e.target.textContent);
    });
});

//DECIMAL POINT
const decimalPoint = document.querySelector('.decPoint');
let decimalPointFlag = false;

//Display the decimal point depending on if there's a stored operator
function displayDecimalPoint(){
    checkInitialized();
    if (!decimalPointFlag){
        decimalPointFlag = true;
        if(checkPrevOperator()){
            numCache.prevNum = numCache.curNum;
            numCache.curNum = '0.';
            display.textContent = '0.';
        }
        else
        {
            numCache.curNum += '.';
            display.textContent += '.';
        }
    }
}
decimalPoint.addEventListener('click', ()=>{
    displayDecimalPoint();
});

//OPERATIONS
//Stored operator
let prevOp = '';

const operations = document.querySelectorAll('.op');
//Calculate the expression and displays it
function calculateOperations(operator){
    let curOp = operator;
    if(operatorInUse){
        prevOp = curOp;
        return;
    }

    operatorInUse = true;
    backspaceFlag = false;
    decimalPointFlag = false;
    if (prevOp === '' || prevOp === '='){
        //do nothing
    }
    else {
        let result = operate(prevOp, numCache.prevNum, numCache.curNum);
        //Round decimals
        console.log(result);
        result = Math.round(result * roundFactor) / roundFactor;
        numCache.curNum = result;
        display.textContent = result;
    }
    prevOp = curOp;
}
operations.forEach((operation) => {
    operation.addEventListener('click', function(e) {
        calculateOperations(e.target.textContent);
    });
});

//BACKSPACE
const backspace = document.querySelector('.backspace-btn');
//Delete the rightmost digit in display and cache
function deleteDigit(){
    if (backspaceFlag){
        numCache.curNum = numCache.curNum.toString().slice(0, -1);
        display.textContent = display.textContent.slice(0, -1);
        //If empty display, automatically put a 0 instead
        if(display.textContent === ''){
            numCache.curNum = 0;
            display.textContent = '0';
            initialized = false;
        }
    }
}
backspace.addEventListener('click', () => {
    deleteDigit();
});

//CLEAR
const clrbtn = document.querySelector('.clr-btn');
//Reset everything to default
function clearAll(){
    display.textContent = 0;
    numCache.prevNum = 0;
    numCache.curNum = 0;
    prevOp = '';
    decimalPointFlag = false;
}
clrbtn.addEventListener('click', () => {
    clearAll();
});

//Keyboard functionality
document.addEventListener('keydown', function(e) {
    switch(true){
        case (Number(e.key) >=0 && Number(e.key) <= 9):
            displayDigit(e.key);
            break;
        case (e.key == '.'):
            displayDecimalPoint();
            break;
        case (e.key == '+' || e.key == '-' || e.key == '*' || e.key == '/' || e.key == '='):
            calculateOperations(e.key);
            break;
        case (e.key == 'Backspace'):
            deleteDigit();
            break;
        case (e.key == 'Escape'):
            clearAll();
            break;
        default:
            break;
    }
});
