document.addEventListener("DOMContentLoaded", function () {
  const resultDisplay = document.getElementById("result");
  const calculationDisplay = document.getElementById("calculation");
  const numberButtons = document.querySelectorAll(".number");
  const operationButtons = document.querySelectorAll(".operator");
  const equalsButton = document.getElementById("equals");
  const clearButton = document.getElementById("clear");

  let currentInput = "";
  let previousInput = "";
  let operation = "";
  let calculated = false;

  // Number button click
  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const number = button.getAttribute("data-number");
      handleNumberClick(number);
    });
  });

  // Operation button click
  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const op = button.getAttribute("data-operation");
      handleOperationClick(op);
    });
  });

  // Equals button click
  equalsButton.addEventListener("click", handleEqualsClick);

  // Clear button click
  clearButton.addEventListener("click", handleClearClick);

  // Keyboard support
  document.addEventListener("keydown", handleKeyDown);

  function handleNumberClick(number) {
    if (calculated) {
      resultDisplay.textContent = number;
      currentInput = number;
      calculated = false;
    } else {
      if (
        resultDisplay.textContent === "0" ||
        resultDisplay.textContent === "Error"
      ) {
        resultDisplay.textContent = number;
        currentInput = number;
      } else {
        resultDisplay.textContent += number;
        currentInput += number;
      }
    }
  }

  function handleOperationClick(op) {
    if (resultDisplay.textContent === "Error") return;

    if (previousInput && currentInput && operation && !calculated) {
      handleEqualsClick();
      previousInput = calculate(previousInput, currentInput, operation);
      operation = op;
      currentInput = "";
      calculated = true;
    } else {
      previousInput = currentInput || resultDisplay.textContent;
      operation = op;
      currentInput = "";
      calculated = false;
    }
    updateCalculationDisplay();
  }

  function handleEqualsClick() {
    if (resultDisplay.textContent === "Error" || !operation) return;

    try {
      const result = calculate(previousInput, currentInput, operation);
      resultDisplay.textContent = result;
      previousInput = result;
      currentInput = "";
      operation = "";
      calculated = true;
      updateCalculationDisplay();
    } catch (error) {
      resultDisplay.textContent = "Error";
      previousInput = "";
      currentInput = "";
      operation = "";
      calculated = true;
      calculationDisplay.textContent = "";
    }
  }

  function handleClearClick() {
    resultDisplay.textContent = "0";
    currentInput = "";
    previousInput = "";
    operation = "";
    calculated = false;
    calculationDisplay.textContent = "";
  }

  function calculate(prev, current, op) {
    const num1 = parseFloat(prev);
    const num2 = parseFloat(current);

    if (isNaN(num1) || isNaN(num2)) return "Error";

    let result;
    switch (op) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "×":
        result = num1 * num2;
        break;
      case "÷":
        if (num2 === 0) throw new Error("Division by zero");
        result = num1 / num2;
        break;
      default:
        return "Error";
    }

    // Handle floating point precision issues
    return Number.isInteger(result)
      ? result.toString()
      : result.toFixed(8).replace(/\.?0+$/, "");
  }

  function updateCalculationDisplay() {
    calculationDisplay.textContent = `${previousInput} ${operation} ${currentInput}`;
  }

  function handleKeyDown(e) {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
      handleNumberClick(e.key);
    } else if (e.key === "+" || e.key === "-") {
      handleOperationClick(e.key);
    } else if (e.key === "*") {
      handleOperationClick("×");
    } else if (e.key === "/") {
      e.preventDefault(); // Prevent browser's find functionality
      handleOperationClick("÷");
    } else if (e.key === "Enter" || e.key === "=") {
      handleEqualsClick();
    } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
      handleClearClick();
    }
  }
});
