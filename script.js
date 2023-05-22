const playerFactory = (name, sign) => {
    console.log(name,sign)
    return {
        name,
        sign
    }
}

const player1 = playerFactory("christa","x");
const player2 = playerFactory("jordan","o");


const gameManager = (() => {
    let _board = [[],[],[]];
    let isTurn;

    let getPlayer = ( ) => {
        if(isTurn == player2  || isTurn == null){
            return isTurn = player1;
           
        }
        else {
          return   isTurn = player2;
           // return player2;
        }
        
    }
    let storeCell  = (obj) => {
        console.log(obj)
     
        if(obj.arr != ''  ){
            displayController.updateDisplay(obj.event);
            return boardUpdate(obj)
        }

        else{
            console.log('error')
        }
    }

    let boardUpdate = (obj) => {
        _board[obj.arr[0]][obj.arr[1]] = player1.sign;
        console.log(_board)
        console.log('isWin?')
    }
    return {
       boardUpdate,
       getPlayer,
       storeCell
    }
})()

const isWin = ((player, board)=>{
    const winningCombinations = [
        [00,01,02],
        [10,11,12],
        [20,21,22],
        [00,11,22], //diagonal
        [02,11,20], //diagonal
        [00,10,20], //vertical
        [01,11,21], //vertical
        [02,21,12]  //vertical
    ]
})()


    

const displayController = (() => {
  
    const spots = document.getElementsByClassName('box');

    for (let i = 0; i < spots.length; i++){
        spots[i].addEventListener("click", (e) => {
              getCell(e);
        })
    }

    const updateDisplay = (e) => {
    
        const player = gameManager.getPlayer();
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
            return gameManager.storeCell(obj)
        }
        
        console.log('error')  
    }

    return{
       updateDisplay,
    }

})()





