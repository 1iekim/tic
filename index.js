const cellCollection = document.querySelectorAll('.cell');
const currentPlayerBox = document.querySelector('.current-turn__symbol')
const restartBtn = document.querySelector('.restart-btn');
const topBtn = document.querySelector('.top-btn');
const topContent = document.querySelector('.top__container');
const topText = document.querySelector('.top__message');
const topExit = document.querySelector('.top__exit');
const topClean = document.querySelector('.clean-top');
const playBox = document.querySelector('.section__container');
const winnerMes = document.querySelector('.winner-div');
let currentPlayer = 'X';
let countX = 0;
let countO = 0;
currentPlayerBox.innerHTML = currentPlayer;
let currentPlay = ['','','','','','','','',''];
let isPause = false;
const winCell = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

let storage = window.localStorage;

playBox.addEventListener('click', playProces);
restartBtn.addEventListener('click', restartGame);
topBtn.addEventListener('click', showTop);
topExit.addEventListener('click', clearTop);
topClean.addEventListener('click', cleanStorage);

function cleanStorage(){
  let isClean = confirm('Do you want to clean storage history?');
  if(isClean){
    storage.clear(); 
    clearTop();
    topContent.classList.remove('undisplay');
  }
}

function playProces(el) {
    if(el.target.className == 'cell' && !isPause){
        if(currentPlay[el.target.dataset.cell].length == 0){
            currentPlay[el.target.dataset.cell] = currentPlayer;
            el.target.insertAdjacentText('afterbegin', currentPlayer);
            currentPlayer == 'X' ? countX++ : countO++;
            changePlayer();
            checkGame();
        }
    }
}

function changePlayer(){
    currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
    currentPlayerBox.innerHTML = currentPlayer;
}

function checkGame(){
    for(let i=0; i<winCell.length; i++){
        let a = currentPlay[winCell[i][0]];
        let b = currentPlay[winCell[i][1]];
        let c = currentPlay[winCell[i][2]];

        if(a==b && b==c && a!=''){
          currentPlayerBox.innerHTML = `Win ${a}`;
          isPause = true;
          let data = new Date();
          
          storage.setItem(storage.length+1, `${a=='X' ? countX : countO}* ${a}* ${data.getHours()+':'+data.getMinutes()+' '+data.getDate()+'-'+ +data.getMonth()+1}`);
          cellCollection[winCell[i][0]].classList.add('winner');
          cellCollection[winCell[i][1]].classList.add('winner');
          cellCollection[winCell[i][2]].classList.add('winner');

          let newDiv = document.createElement('div');
          newDiv.classList.add('winner__content');
          newDiv.innerHTML = `
          <span>Winner: ${a}</span>
          <span>Turns: ${a=='X' ? countX : countO}</span>`
          winnerMes.insertAdjacentElement('beforeend', newDiv);
          winnerMes.classList.remove('undisplay');

          setTimeout(function(){
            let elem = document.querySelector('.winner__content');
            elem.remove();
            winnerMes.classList.add('undisplay');
            winnerMes.innerHTML = '';
          }, 2000);

          break;
        } else if(!currentPlay.filter(el => el.length == 0).length){
            currentPlayerBox.innerHTML = 'No move!';
        }
    }
}

function restartGame(){
  currentPlayer = 'X';
  currentPlay = ['','','','','','','','',''];
  isPause = false;
  currentPlayerBox.innerHTML = currentPlayer;
  cellCollection.forEach(el => el.innerHTML = '');
  cellCollection.forEach(el=>el.classList.remove('winner'))
  countO = 0;
  countX = 0;
}

function showTop(){
  topContent.classList.remove('undisplay');
  let topArr = [];
  for(let i=0; i<storage.length; i++){
    let key = storage.key(i);
    console.log(`${key}: ${storage.getItem(key)}`);
    topArr.push(storage.getItem(key).split('*'));
  }
  topArr = topArr.sort((a,b)=>a[0]-b[0]);
  for(let i=0; i<topArr.length && i<10; i++){
    let messageContainer = document.createElement('div');
    messageContainer.classList.add('message__container');
    topText.insertAdjacentElement('beforeend', messageContainer);
    messageContainer.insertAdjacentHTML('afterbegin', `
    <span class="message__elem">${i+1}</span>
    <span class="message__elem">${topArr[i][0]||' '}</span>
    <span class="message__elem">${topArr[i][1]||' '}</span>
    <span class="message__elem">${topArr[i][2]||' '}</span>`);

  }
}

function clearTop(){
  topContent.classList.add('undisplay');
  let mes = document.querySelectorAll('.message__container');
    console.log(mes);
  mes.forEach(el => el.remove());
  console.log(mes);
}