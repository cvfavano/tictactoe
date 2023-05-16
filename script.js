const playerFactory = (name, sign) => {
    console.log(name,sign)
    return {
        name,
        sign
    }
}

const gameBoard = () => {
    let board = [[null,null,null],[null,null,null],[null,null,null]];
    let enterMove = (e) => {
        const divID = document.getElementById(e.target.id);

        const x = `${e.target.id.substring(0,1)}`;
        const y = e.target.id.substring(1);
        
        if(board[x][y] == null){
            board[x][y] = player1['sign'];
            console.log(player1['sign']);
            console.log(board);
            displayController().updateDisplay(e);
        };
    }
    return {
        board,
        enterMove
    }
}

const displayController = () => {
    let array = gameBoard().board;
  
    const spots = document.getElementsByClassName('box');
    const updateBoard = () => {
        for (let i = 0; i < spots.length; i++){
            spots[i].addEventListener("click", gameBoard().enterMove);
        }
        
    }
//add player
    const updateDisplay = (e) => {

        const divID = document.getElementById(e.target.id);
        const textNode = document.createTextNode(player1['sign']);
        divID.appendChild(textNode);
    }

    return{
       // array,
       updateBoard ,
       updateDisplay
    }
};


const player1 = playerFactory("christa","x");
displayController().updateBoard();

