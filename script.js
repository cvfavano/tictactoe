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
const board = () => {
    let _board = [[],[],[]];
   
    let storeCell  = (obj) => {
        
           if(obj.arr != ''  ){
               displayController.updateDisplay(obj.event);
               return boardUpdate(obj)
            }
   
           else{
               console.log('error')
            }
       }
   
       let boardUpdate = (obj) => {   
            let currentSign = gameManager.getPlayer().sign
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
}    


const displayController = (() => {
let players;
    const markBoardwithTurn = () => {
  
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click", (e) =>{
                getCell(e);
                updateDisplay(e);
            })
        }
    }

    const stopUpdate = () => {
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].removeEventListener("click", getCell);
        }
    }

    //uses game manager player
    const updateDisplay = (event) => {
        console.log(event )
        const player = gameManager.getPlayer();
        
        // !!!!
        //fix this its taking in submit button id
        
        const divID = document.getElementById(event.target.id);
       // console.log(player[sign]);
        console.log(player.sign);
        const textNode = document.createTextNode(player.sign);
   //     players[player]['sign']
   console.log(textNode)
        divID.appendChild(textNode);
    }

    let checkCell = (e) => {
        const divID = document.getElementById(e.target.id);
        
        if(divID.innerHTML != "") {
            return false
        }
        
        return true
    }

    function getCell(e){
        const x = e.target.id.substring(0,1);
        const y = e.target.id.substring(1);
        const obj = {arr:[x,y], event:e }
        const cellStatus = checkCell(e);
    
        if(cellStatus) {
            return board().storeCell(obj)
        }
        
        console.log('error')  
    }

    function changeColor(winningArray){

        winningArray.forEach((combo) => {
            document.getElementById(combo).style.color = 'green';

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

    return{
       updateDisplay,
       stopUpdate,
       changeColor,
       markBoardwithTurn,
       formData, 
       toggleModal,
       getCell
    }


})()

const gameManager = (() => {
let currentPlayer;
  //  let isWin;

    // let changeTurn = ( ) => {

    //     if(players != undefined) {
    //     if(currentPlayer == players.p1  || currentPlayer == null)
    //         return currentPlayer = players.p1;
        
    //     else 
    //       return   isTurn = players.p2;

    //     }
    // }

    let getPlayer = () => {
        if(currentPlayer == undefined || currentPlayer != usersModel.players._p2 ){
            //console.log(usersModel.players()._p1)
            currentPlayer = usersModel.players()._p1;
        
            return  currentPlayer;
        }
    
        else {
            currentPlayer = usersModel.players._p2;
          //  console.log(currentPlayer)
            return   currentPlayer;
        }
   
    }
   



    let  findWin = (comboArray, boardArray) => {
    
        let currentPlayer = getPlayer();
        comboArray.forEach( (combo) => {
          for(let i = 0; i < combo.length; i++){

                //split string to find row/column pair in 2d array
                if (boardArray[combo[0].substring(0,1)][combo[0].substring(1)] === currentPlayer.sign &&
                    boardArray[combo[1].substring(0,1)][combo[1].substring(1)] === currentPlayer.sign &&
                    boardArray[combo[2].substring(0,1)][combo[2].substring(1)] === sign &&
                    boardArray[combo[0].substring(0,1)][combo[0].substring(1)] != currentPlayer.null &&
                    boardArray[combo[1].substring(0,1)][combo[1].substring(1)] != null &&
                    boardArray[combo[2].substring(0,1)][combo[2].substring(1)] != null) {
                        
                       
                                         
                        return true;   
                }

                else {
                    return false 
                }
               
            }
             
        })
       
    };

  


    

    return {
        getPlayer,
        // changeTurn, 
        findWin
    
    }
})()

const playGame = () => {
    let player;
    let isWin = false;
    displayController.toggleModal();
  //  let names;
    let players;
    const button = document.querySelector('#submit-button');

    button.addEventListener('click', (event) => {
        event.preventDefault();
    
        displayController.formData();
           
        usersModel.players();
        addTurntoBoard();
        
    })

    function addTurntoBoard() {
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click",(event) => {
                displayController.getCell(event);
                checkWin();
            })
        }
    }
    function checkWin(){
        displayController.markBoardwithTurn();
        displayController.updateDisplay();
        let currentBoard = board().currentBoard;
        isWin = gameManager.findWin(winningCombinations,currentBoard);

        if(isWin) {
            console.log('WIN ' + currentPlayer)  ;
            displayController.stopUpdate();
            displayController.changeColor(combo);
            console.log('win')
        }
        else{
            player = gameManager.getPlayer();
            gameManager.changeTurn(); //fix this
            findWinner();
        }
    } 
}

playGame();