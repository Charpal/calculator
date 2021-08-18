//Flags
let initialized = false;
let usedOperator = false;
let backspaceFlag = true;
const roundFactor = 100000000;
const calculatorLimit = 99999999999999;

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
let numCache = {
    prevNum: 0,
    curNum: 0,
};
let prevOp = '';

function checkInitialized(){
    if (!initialized){
        initialized = true;
        display.textContent = '';
    }
}

function checkPrevOperator() {
    if (usedOperator){
        usedOperator = false;
        backspaceFlag = true;
        return true;
    }
    return false;
}

function displayDigit(currentDisplay){
    if(display.textContent.length <= 11){
        checkInitialized();
        
        if (checkPrevOperator()){
            //if previous button was an operator, clear out display and add number
            numCache.prevNum = numCache.curNum;
            numCache.curNum = currentDisplay;
            display.textContent = numCache.curNum;
        }
        else {
            numCache.curNum += currentDisplay;
            display.textContent += currentDisplay;
        }
        // console.table(numCache);
    }
    else {
        if (checkPrevOperator()){
            numCache.prevNum = numCache.curNum;
            numCache.curNum = currentDisplay;
            display.textContent = numCache.curNum;
        }
    }
}

digits.forEach((digit) => {
    digit.addEventListener('click', function(e){
        displayDigit(e.target.textContent);
    });
});

const decimalPoint = document.querySelector('.decPoint');
let pointOn = false;
function displayDecimalPoint(){
    if (!pointOn){
        pointOn = true;
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

const operations = document.querySelectorAll('.op');
function calculateOperations(operator){
    let curOp = operator;
        if(usedOperator){
            prevOp = curOp;
            return;
        }
        usedOperator = true;
        backspaceFlag = false;
        pointOn = false;
        // console.log("Previously used: " + prevOp);
        // console.log("Currently using: " + curOp);
        if (prevOp === '' || prevOp === '='){

        }
        else {
            let result = operate(prevOp, numCache.prevNum, numCache.curNum);
            result = Math.round(result * roundFactor) / roundFactor;
            if (result > calculatorLimit){
                display.textContent = 'ERROR';
            }
            else{
                numCache.curNum = result;
                // console.log("Result: " + result);
                display.textContent = result;
            }
            
        }
        prevOp = curOp;
}
operations.forEach((operation) => {
    operation.addEventListener('click', function(e) {
        calculateOperations(e.target.textContent);
    });
});

const backspace = document.querySelector('.backspace-btn');
function deleteDigit(){
    if (backspaceFlag){
        numCache.curNum = numCache.curNum.toString().slice(0, -1);
        display.textContent = display.textContent.slice(0, -1);
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

const clrbtn = document.querySelector('.clr-btn');
function clearAll(){
    display.textContent = 0;
    numCache.prevNum = 0;
    numCache.curNum = 0;
    prevOp = '';
    pointOn = false;
}
clrbtn.addEventListener('click', () => {
    clearAll();
});

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
    // console.log(e.key);
});
