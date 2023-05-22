const playerFactory = (name, sign) => {
    console.log(name,sign)
    return {
        name,
        sign
    }
}

const gameBoard = (() => {
 
     let storeCell  = (obj) => {
        console.log(obj)
        if(obj != null){
           
            console.log(obj);
            displayController.updateDisplay(obj.event);
           
             return gameManager.boardUpdate(obj)
        }

        else{
             console.log('error')
             return null;
        }
    }
 
    let getCell = (e) => {
       // const divID = document.getElementById(e.target.id);
        console.log(e.target.id)
        const x = `${e.target.id.substring(0,1)}`;
        console.log(x)
        const y = e.target.id.substring(1);
        const obj = {arr:[x,y], event:e }
        console.log(obj)
      
             gameBoard.storeCell(obj)
        
    }
        
    
    return {
       // enterMove,
        storeCell, 
        getCell
    }
})()
    

const displayController = (() => {
  
    const spots = document.getElementsByClassName('box');
let result;
  //  const spots = document.getElementsByClassName('box');
        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click", (e) => {
                  result = gameBoard.getCell(e);
            })
        }
//add player
    const updateDisplay = (e) => {

        const divID = document.getElementById(e.target.id);
        const textNode = document.createTextNode(player1['sign']);
        divID.appendChild(textNode);
    }

    return{
       // array,
     //  addListener,
       updateDisplay,
       result
       
    }
})()


const gameManager = (() => {
    let board = [[],[],[]];
    
        console.log(displayController.result);
      
    
    let boardUpdate = (obj) => {
        board[obj.arr[0]][obj.arr[1]] = player1.sign;
        console.log(board)
    }

    return {
        //publicMethod
        boardUpdate
 }
  
})()


const player1 = playerFactory("christa","x");

