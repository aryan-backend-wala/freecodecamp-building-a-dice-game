const listOfAllDice = document.querySelectorAll('.die');
const scoreInputs = document.querySelectorAll('#score-options input');
const scoreSpans = document.querySelectorAll('#score-options span');
const currentRoundRollsText = document.getElementById('current-round-rolls');
const currentRoundText = document.getElementById('current-round');
const totalScoreText = document.getElementById('total-score');
const scoreHistory = document.getElementById('score-history');
const rulesBtn = document.getElementById('rules-btn');
const keepScoreBtn = document.getElementById('keep-score-btn');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const rulesContainer = document.querySelector('.rules-container');
let currentValuesInDie = [];
let isModalShowing = false;
let rolls = 0;
let score = 0;
let totalScore = 0;
let round = 1;

const resetGame = () => {
  currentValuesInDie = [0,0,0,0,0];
  rolls = 0;
  score = 0;
  totalScore = 0;
  round = 1;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = currentValuesInDie[index];
  });
  updateStatus();
  scoreHistory.innerHTML = "";
  totalScoreText.textContent = totalScore;
}

const updateStatus = () => {
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;
}

const getUpdatedScore = (indexNode, score) => {
  scoreInputs[indexNode].value = score;
  scoreInputs[indexNode].disabled = false;
  scoreSpans[indexNode].textContent = `, score = ${score}`;
}

const resetInput = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });
  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
}

const rollDice = () => {
  currentValuesInDie = [];

  for(let i=0;i<5;i++){
    const result = Math.floor(Math.random() * 6) + 1;
    currentValuesInDie.push(result);
  }
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = currentValuesInDie[index];
  });
}

const threeFourOfAKind = (arr) => {
  let counts = {};
  for(let num of arr){ 
    if(counts[num]){
      counts[num] += 1;
    } else {
      counts[num] = 1;
    }
  }
  let highestCount = 0;
  for(let num of arr){
    let count = counts[num];
    if(count >= 3 && count > highestCount){
      highestCount = count;
    }
    if(count >= 4 && count > highestCount){
      highestCount = count;
    }
  }

  const sumOfAllDice = currentValuesInDie.reduce((sum, value) => sum + value, 0);

  if(highestCount >= 3){
    getUpdatedScore(0, sumOfAllDice);
  }
  if(highestCount >= 4){
    getUpdatedScore(1, sumOfAllDice);
  }
  getUpdatedScore(5, 0);
}

const getFullHouse = (arr) => {
  let counts = {};
  for(let num of arr){
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  const countsValues = Object.values(counts);
  const threeOfAKind = countsValues.includes(3);
  const hasPair = countsValues.includes(2);

  if(threeOfAKind && hasPair){
    getUpdatedScore(2, 25);
  }
  getUpdatedScore(5, 0);
}

const checkedStraight = (arr) => {
  const sorted = arr.sort((a, b) => a - b);
  const uniqueValues = [...new Set(sorted)];
  const uniqueValuesStr = uniqueValues.join("");
  const smallStraight = ['1234', '2345', '3456'];
  const largeStraight = ['12345','23456'];
  if(smallStraight.includes(uniqueValuesStr)){
    getUpdatedScore(3, 30);
  }
  if(largeStraight.includes(uniqueValuesStr)){
    getUpdatedScore(4, 40);
  }
  getUpdatedScore(5, 0);
}

rollDiceBtn.addEventListener("click", () => {
  if(rolls === 3){
    alert("You have roll 3 times, you need to select the score now.");
  } else {
    rolls++;
    rollDice();
    resetInput();
    updateStatus();
    threeFourOfAKind(currentValuesInDie);
    getFullHouse(currentValuesInDie);
    checkedStraight(currentValuesInDie);
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  scoreInputs.forEach((input) => {
    if(input.checked){
      selectedValue = input.id;
      achieved = input.value;
    }
  });
  
  if(selectedValue){
    rolls = 0;
    round++;
    totalScore += parseInt(achieved);
    totalScoreText.textContent = totalScore;
    scoreHistory.innerHTML += `<li>${selectedValue}: ${achieved}</li>`;
    updateStatus();
    resetInput();
    if(round > 6){
      setTimeout(() => {
        alert("Game over!, Your total score is " + totalScore);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please any value or click on roll dice button.");
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;
  if(isModalShowing){
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});