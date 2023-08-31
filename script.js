const usersModel = (() => {

    let _p1;
    let _p2;

    let playerFactory = ( name, sign) => {
        if (_p1 == undefined) {
            _p1 = {name,sign}
            return _p1;
        } 
        else{ 
            _p2 = {name, sign}
            return _p2;
        }
    }

    let players = () =>
    {
        return {
            _p1,_p2
        } 
    }
    return {
        playerFactory,
        players
    }
})()

 const winningCombinations = [
        ['00','01','02'],
        ['10','11','12'],
        ['20','21','22'],
        ['00','11','22'], //diagonal
        ['02','11','20'], //diagonal
        ['00','10','20'], //vertical
        ['01','11','21'], //vertical
        ['02','21','12' ] //vertical
]
const board = (() => {
    let _board = [[],[],[]];

    let storeCell  = (obj) => {
    
        if(obj.arr != ''  ){
            return boardUpdate(obj)
        }

        else{
            console.log('error')
        }
    }

    let boardUpdate = (obj) => {   
        let turnNum = playGame.currentTurnNum();
        let currentTurnPlayer = gameManager.currentTurn(turnNum);
        
        let currentSign = currentTurnPlayer.sign;
        
        _board[obj.arr[0]][obj.arr[1]] = currentSign;
        
    }

    let clearBoard = () => {
        _board = [[],[],[]];
        return _board;
    }

    let currentBoard = () => {
        return _board;
    }

    return {
        boardUpdate,
        storeCell, 
        clearBoard, 
        currentBoard
    }       
})()


const displayController = (() => {
    const stopUpdate = () => {
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].removeEventListener("click",playGame.turnPlay, playGame.once);
        }
    }
   
    const updateDisplay = (e) => {
  
        let termNumber = playGame.currentTurnNum();

        const player = gameManager.currentTurn(termNumber);  
        
        const divID = document.querySelector(`div#${e.target.id}`);
        const textNode = document.createTextNode(player.sign);
        divID.appendChild(textNode);
    }

    const clearDisplay = () => {
        const spots = [...document.querySelectorAll('.box')];
        spots.forEach(spot => { 
            const divID = document.querySelector(`#${spot.id}`);
              
            divID.style.color = null;
            divID.textContent ='';
        })
    }

    let checkCell = (e) => {
        const divID = document.getElementById(e.target.id);
        
        if(divID.innerHTML != "") {
            return false
        }
        
        return true
    }

    function getCell(e){
        const x = e.target.id.substring(5,6);
        const y = e.target.id.substring(6);
        const obj = {arr:[x,y], event:e }
        const cellStatus = checkCell(e);
    
        if(cellStatus) {
            board.storeCell(obj);
            return true;
        }
        
        return false;
    }

    function changeColor(winningArray){
        winningArray.forEach((combo) => {
            document.getElementById(`space${combo}`).style.color = 'green';
        })
    }

    let checkForm = (player, num) =>  {
        if (player === '' ) {
            toggleValidation(num, true);
            return false;
        }
        return true;    
    }
          
    function toggleValidation(playerNum, displayStatus){
        const errorMessage = document.querySelector(`span.invalid-player${playerNum}`);

        if(!displayStatus) {
            errorMessage.style.display = 'none';
            
        }
        else {
            errorMessage.style.display = 'block';
        }
    } 

    function toggleModal ()     {
        const modal = document.querySelector('#modal-container');
        const button = document.querySelector('.add-player');
        const exitButton = document.querySelector('.close');

        button.addEventListener('click', () => {
            modal.style.display = 'block';
              
        });
        
        exitButton.addEventListener('click', () => {
            modal.style.display = 'none';
           
        });
    }
    
    let formData = () => {

        const form = document.querySelector('#form');
        const formData = new FormData(form ); 
    
        let player1 = formData.get('player1');
        let player2 = formData.get('player2');

        if(!checkForm(player1) || !checkForm(player2)){
            return
        }

        let p1 = usersModel.playerFactory(player1, "x");
        let p2 = usersModel.playerFactory(player2, "o");
        usersModel.players(p1,p2);
           
        const modals = document.querySelector('#modal-container');  
        modals.style.display ='none';
    }

    

    function resetGame() {
        const button = document.querySelector('#reset');
        let formPlayers = document.querySelectorAll('#form input');
        console.log({formPlayers})
        button.addEventListener('click', (e) => {
          board.clearBoard();
          //ALSO CLEAR GREEN STYLING
          //CLEAR FORM PLAYERS
          clearDisplay();
            // [...formPlayers].forEach((player) => {
            //     player ='';
            // });
            toggleButton('button.playAgainBtn');
            toggleButton('button.add-player');
        })
        }
      

        function playAgain() {
            //does not reset players
            const button = document.querySelector('.playAgainBtn');
            button.addEventListener('click', (e) => {
                
                console.log({players:usersModel.players()});
                toggleButton('button.playAgainBtn');
                board.clearBoard();
                clearDisplay();
                playGame.addTurnToBoard();   
            })
        }

        function toggleButton(button) {
  
            const  btn = document.querySelector(button);
           
            if(window.getComputedStyle(btn, null).display== 'inline'  ||window.getComputedStyle(btn, null).display == 'inline-block') {
                btn.style.display = 'none';
            }

            else {
                btn.style.display ='inline';
            }
        }
        return{
            updateDisplay,
            stopUpdate,
            changeColor,
            formData, 
            toggleModal,
            getCell,
            resetGame,
            playAgain,
            toggleButton
    }
})()

const gameManager = (() => {
    let _currentPlayer;
    //fix turn at reset
    let changeTurn = (termNum ) => {
        const users = usersModel.players();

        // if divisible by 2, then currentPlayer is p2. Change player to p1
        if(termNum % 2 != 0){
            _currentPlayer = users._p2;
            return _currentPlayer;
        }
        
        else{ 
            _currentPlayer = users._p1;
            return _currentPlayer;
        }
        
    }

    let currentTurn = () => {
        const users = usersModel.players();
        let termNum = playGame.currentTurnNum();
    
        if(termNum % 2 != 0){   
            return users._p1;
        }
   
        else{ 
            return users._p2;
        }
    }

    let  findWin = ( boardArray) => {
        let currentPlayer = currentTurn();
        let comboArray = winningCombinations;
        let endGame = false;
        comboArray.forEach( (combo) => {
          for(let i = 0; i < combo.length; i++){

                //split string to find row/column pair in 2d array
                if (boardArray[combo[0].substring(0,1)][combo[0].substring(1)] == currentPlayer.sign &&
                    boardArray[combo[1].substring(0,1)][combo[1].substring(1)] == currentPlayer.sign &&
                    boardArray[combo[2].substring(0,1)][combo[2].substring(1)] == currentPlayer.sign) {
                    displayController.changeColor(combo);
                    
                   endGame = true;
                }
            }
        })
        return endGame;
    };
    return {
        changeTurn, 
        findWin, 
        currentTurn
    }
})()

const playGame = (() => {
    displayController.toggleModal();

    displayController.resetGame();
    
    let _termNum = 1;
    let currentTurnNum = () => {
        return _termNum
    }
    const button = document.querySelector('#submit-button');

    button.addEventListener('click', (event) => {
        event.preventDefault();
    
        displayController.formData();
        opponents = usersModel.players();
        displayController.toggleButton('button.add-player');
        addTurnToBoard();   
        
    })

    function addTurnToBoard() {
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click",turnPlay, once);
        }
    }
    const once = {once: true};
    let turnPlay =    function logTurn(e) {
            let isEmptycell  = displayController.getCell(e);
            if (isEmptycell){
                displayController.updateDisplay(e);

                if(_termNum > 4) {
                    checkWin();
                }
            }
        _termNum++;
    
        }
    
    
    function checkWin(){
        let currentBoard = board.currentBoard();
        let endGame = gameManager.findWin(currentBoard);
 
        if(!endGame) {
           addTurnToBoard(); 
        }
        else{ 
            displayController.toggleButton('button.playAgainBtn');
            displayController.stopUpdate();
            //set termNum back to x, will be set to 0 after incremented in turnPlay()
            displayController.playAgain();
            _termNum = 0;
            return;
        }
    } 

    return{
        currentTurnNum,
        turnPlay, 
        once,
        addTurnToBoard
    }
})()  