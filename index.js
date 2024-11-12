const inputSlider = document.querySelector("[data-legnthSlider]");
const lengthDisplay = document.querySelector("[data-legnthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generator-button");
const allChechBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*():;+=/?";
let password = "";
let passwordLength = 8;
let checkCount = 0;

handleSlider();

// Set initial strength status
calcStrength();

// Set password length slider
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomNumber() {
  return getRandomInt(0, 9);
}
function generateLowercase() {
  return String.fromCharCode(getRandomInt(97, 123));
}
function generateUppercase() {
  return String.fromCharCode(getRandomInt(65, 91));
}
function generateSymbol() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum);
}

// Calculate password strength based on criteria
function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numberCheck.checked;
  let hasSym = symbolsCheck.checked;

  const strengthStatus = document.querySelector("[data-strengthStatus]");

  if (password.length >= 12 && hasUpper && hasLower && hasNum && hasSym) {
    strengthStatus.innerText = "Strong";
    strengthStatus.style.color = "#0f0"; // Green for strong
  } else if (
    password.length >= 8 &&
    ((hasUpper && hasLower) || (hasNum && hasSym))
  ) {
    strengthStatus.innerText = "Medium";
    strengthStatus.style.color = "#ff0"; // Yellow for medium
  } else {
    strengthStatus.innerText = "Weak";
    strengthStatus.style.color = "#f00"; // Red for weak
  }
}

// Copy password to clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxChange() {
  checkCount = 0;
  allChechBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

// Shuffle password for randomness
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array.join("");
}

allChechBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUppercase);
  if (lowercaseCheck.checked) funcArr.push(generateLowercase);
  if (numberCheck.checked) funcArr.push(getRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});
