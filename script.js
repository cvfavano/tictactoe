const playerFactory = (name, sign) => {
    return {
    name,
    sign
    }
}

const board = (() => {
    let _board = [[],[],[]];
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
            let currentSign = gameManager().getPlayer().sign
           _board[obj.arr[0]][obj.arr[1]] = currentSign;
         
       }

       let clearBoard = () => {
         _board = [[],[],[]];
         return _board;
       }


    return {
        boardUpdate,
        storeCell, 
        clearBoard
    }   
}    
)()

const displayController = (() => {
  
    const markBoard = () => {
  
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click", getCell);
        }
    }

    const stopUpdate = () => {
        const spots = document.getElementsByClassName('box');

        for (let i = 0; i < spots.length; i++){
            spots[i].removeEventListener("click", getCell);
        }
    }

    //uses game manager player
    const updateDisplay = (e) => {
        const player = gameManager().getPlayer();
        const divID = document.getElementById(e.target.id);
        const textNode = document.createTextNode(player['sign']);
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
            return board.storeCell(obj)
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
          
        else {
       
            return true;
        }
    
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
        // const button = document.querySelector('#submit-button');

        // button.addEventListener('click', (event) => {
        //     event.preventDefault();
            const form = document.querySelector('#form');
            const formData = new FormData(form ); 
    
            let player1 = formData.get('player1');
            let player2 = formData.get('player2');

            if(!checkForm(player1,1) || 
            !checkForm(player2,2)){
                return
            }
            const p1= playerFactory(player1, "x");
            const p2 = playerFactory(player2, "o");
            
           
           
        const modals = document.querySelector('#modal-container');  
        modals.style.display ='none';
       
            return { 
                p1, p2     
            };
            
           // gameManager(players);


    // })

    }
    return{
       updateDisplay,
       stopUpdate,
       changeColor,
       markBoard,
       formData, 
       toggleModal
    }


})()

const gameManager = () => {
    displayController.toggleModal();
    let isTurn;
    let players;
    let changeTurn = (personObject ) => {

        if(isTurn == personObject.p1  || isTurn == null)
            return isTurn = personObject.p1;
        
        else 
          return   isTurn = personObject.p2;
    }
   
    let getPlayer = (personObject) => {
        if(isTurn == null || isTurn != personObject.p2 )
                return isTurn = personObject.p1;
    
        else 
            return   isTurn = personObject.p2; 
    }
    const button = document.querySelector('#submit-button');

    button.addEventListener('click', (event) => {
            event.preventDefault();
    
              players = displayController.formData();
  
            console.log('here')
            console.log(players)

    displayController.markBoard();


   

    let isWin  =  function findWin(comboArray, boardArray, sign) {
      
        comboArray.forEach( (combo) => {
          for(let i = 0; i < combo.length; i++){

                //split string to find row/column pair in 2d array
                if (boardArray[combo[0].substring(0,1)][combo[0].substring(1)] === sign &&
                    boardArray[combo[1].substring(0,1)][combo[1].substring(1)] === sign &&
                    boardArray[combo[2].substring(0,1)][combo[2].substring(1)] === sign){
                        
                        console.log('WIN ' + getPlayer().name)  ;
                        displayController.stopUpdate();
                        displayController.changeColor(combo);
                     
                        return true;         
                }
            }
        })
    };

    

    do{
        changeTurn(players);
        getPlayer(players);
       
    } while(isWin == false)

  
    })

    return {
        getPlayer,
   
      changeTurn
    
    }
}


gameManager();