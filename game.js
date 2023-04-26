//Game variables
const doors = [];
let winningDoorIndex;
let pickedDoor;
let revealedDoor;

//DOM elements
const doorsDiv = document.querySelector("#doors");
const gameDiv = document.querySelector(".game");
const instructions = document.querySelector("#instructions");
const buttonsDiv = document.querySelector('.buttons')
const switchButton = document.querySelector("#switchButton");
const stayButton = document.querySelector("#stayButton");
const playAgainButton = document.querySelector("#playAgainButton");
const stats = document.querySelector("#stats");


//Stats variables
let SwitchPlays = parseInt(localStorage.getItem('SwitchPlays')) || 0;
let StayPlays = parseInt(localStorage.getItem('StayPlays')) || 0;
let SwitchWins = parseInt(localStorage.getItem('SwitchWins')) || 0;
let StayWins = parseInt(localStorage.getItem('StayWins')) || 0;
let switchRate = parseFloat(localStorage.getItem('switchRate')) || 0;
let stayRate = parseFloat(localStorage.getItem('stayRate')) || 0;
stats.innerHTML = `
Switch plays: ${SwitchPlays} <br>
Switch win rate: ${(Math.round(switchRate * 100)).toFixed(2)}%<br>
Stay plays: ${StayPlays}<br>
Stay win rate: ${(Math.round(stayRate * 100)).toFixed(2)}%
`

function setup() {
  instructions.innerHTML = 'Select a door!';
  for (let i = 0; i < 3; i++) {
    const door = document.createElement("div");
    door.classList.add("door");
    door.setAttribute('prize', "🐴")
    door.setAttribute('index', i)
    doors.push(door);
    doorsDiv.appendChild(door);

  }

  winningDoorIndex = Math.floor(Math.random() * 3); 
  doors[winningDoorIndex].setAttribute('prize', "💰");
}

function clickHandler(event) {
  if (event.target.classList.contains("door")) {

    const index = event.target.getAttribute('index');
    setTimeout(() => { 
      for (let i = 0; i < 3; i++) {
        const door = doors[i];
        const doorIndex = door.getAttribute('index');
        if (doorIndex != index && doorIndex != winningDoorIndex){
          revealedDoor = door;
          door.innerHTML = door.getAttribute('prize');
          break;
        }
      }
      //buttons
      switchButton.style.display = "";
      stayButton.style.display = "";
      buttonsDiv.appendChild(switchButton);
      buttonsDiv.appendChild(stayButton);
      instructions.innerHTML = `I am revealing a door.<br>
      Do you want to switch or stay with your selection?`
     }, 1500);
    //door user clicked
    pickedDoor = doors[index];
    doors[index].style.backgroundColor='lightblue';
    instructions.innerHTML = `You selected door number ${Number(index) + 1}`
    document.removeEventListener("click", clickHandler);
  }
}

setup();
document.addEventListener("click", clickHandler);

switchButton.addEventListener("click", (e)=>{
  SwitchPlays++;
  localStorage.setItem('SwitchPlays', SwitchPlays);
  
  let newPick;
  pickedDoor.style.backgroundColor='brown';
  for (let i = 0; i < 3; i++) {
    let door = doors[i];
    if (door != pickedDoor && door != revealedDoor){
      newPick = door;
      break;
    }
  }
  pickedDoor = newPick;
  switchButton.style.display = "none";
  stayButton.style.display = "none";
  instructions.innerHTML = `Switching selected door...`
  pickedDoor.style.backgroundColor='lightblue';
  setTimeout(() => { checkWin(true) }, 1500);
})

stayButton.addEventListener("click", ()=>{
  StayPlays++;
  localStorage.setItem('StayPlays', StayPlays);
  switchButton.style.display = "none";
  stayButton.style.display = "none";
  instructions.innerHTML = `Sticking with your first choice...`
  setTimeout(() => { checkWin(false) }, 1500);
});

function checkWin(playerSwitch){

  for (let door of doors){
    door.innerHTML = door.getAttribute('prize');
    door.style.backgroundColor='brown';
  }
  const prize = pickedDoor.getAttribute('prize');
  if (prize == "💰"){
    pickedDoor.style.backgroundColor='lightgreen';
    instructions.innerHTML = `You win`
    
    if (playerSwitch){
      SwitchWins++;
      localStorage.setItem('SwitchWins', SwitchWins);
    }else{
      StayWins++;
      localStorage.setItem('StayWins', StayWins);
    }

  }else {
    pickedDoor.style.backgroundColor='red';
    instructions.innerHTML = `You lose`
  }
  switchRate = SwitchWins / SwitchPlays;
  localStorage.setItem('switchRate', switchRate);

  stayRate = StayWins / StayPlays;
  localStorage.setItem('stayRate', stayRate);

  if (isNaN(switchRate)) {
    switchRate = 0;
  }
  
  if (isNaN(stayRate)) {
    stayRate = 0;
  }

  stats.innerHTML = `
  Switch plays: ${SwitchPlays} <br>
  Switch win rate: ${(Math.round(switchRate * 100)).toFixed(2)}%<br>
  Stay plays: ${StayPlays}<br>
  Stay win rate: ${(Math.round(stayRate * 100)).toFixed(2)}%
  `

  playAgainButton.style.display = "";
  buttonsDiv.appendChild(playAgainButton);
  gameDiv.appendChild(stats);
}

playAgainButton.addEventListener("click", ()=>{
  instructions.innerHTML = 'Select a door!';
  for (let door of doors){
    door.setAttribute('prize', "🐴");
    door.innerHTML= '';
    door.style.backgroundColor ='brown';
  }
  winningDoorIndex = Math.floor(Math.random() * 3); 
  doors[winningDoorIndex].setAttribute('prize', "💰");
  playAgainButton.style.display = "none";
  document.addEventListener("click", clickHandler);
})

function resetStats(){
  localStorage.clear();
}