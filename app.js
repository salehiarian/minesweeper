var result = document.getElementById('result')

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let flags = 0
    let squares = []
    let isGameOver = false
    let bombAmount = 20
  
  
    //create Board
    function createBoard() {

      //get shuffled game array with random bombs
      const bombsArray = Array(bombAmount).fill('bomb')
      const emptyArray = Array(width*width - bombAmount).fill('valid')
      const gameArray = emptyArray.concat(bombsArray)
      const shuffledArray = gameArray.sort(() => Math.random() -0.5)
  
      for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)
        squares.push(square)
        console.log(squares[i])
        
        //normal click
        square.addEventListener('click', function(e) {
          click(square)
        })
        
        // ctrl and right click
        square.oncontextmenu = function(e) {
          e.preventDefault()
          addFlag(square)
        }
          
        square.addEventListener('long-press', function(e) {
           addFlag(square)
        });
      }
  
      //add numbers
      for (let j = 0; j < squares.length; j++) {
        let total = 0
        const isLeftEdge = (j % width === 0)
        const isRightEdge = (j % width === width -1)
        const isTopEdge = j <= 9
        const isBottomEdge = j >= 90
        // if (squares[i].classList.contains('valid')) {
        //   if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        //   if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        //   if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        //   if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        //   if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        //   if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        //   if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        //   if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        if (squares[j].classList.contains('valid')) {
          if (!isTopEdge && !isRightEdge && squares[j + 1 - width].classList.contains('bomb'))    //north east
          total++;
      
          if (!isRightEdge && squares[j+1].classList.contains('bomb'))   // right
              total++;
          if (!isLeftEdge && squares[j-1].classList.contains('bomb')) //left
              total++;

          if (!isTopEdge && squares[j-10].classList.contains('bomb')) //top
              total++;
          
          if (!isBottomEdge && squares[j+10].classList.contains('bomb')) //bottom
              total++;
          
          if (!isTopEdge && !isLeftEdge && squares[j - 1 - width].classList.contains('bomb'))  //north west
              total++;
          
          if (!isLeftEdge && !isBottomEdge && squares[j-1 + width].classList.contains('bomb')) // south west
              total++;
          
          if (!isRightEdge && !isBottomEdge && squares[j + 1 + width].classList.contains('bomb')) //south east
            total++;   
            
          squares[j].setAttribute('data', total)



        }
      }
    }
    
    createBoard()
    
    // add a flag to a square
    function addFlag(square){
      if (isGameOver)  return
      if (!square.classList.contains('checked') && (flags < bombAmount)){
        if (!square.classList.contains('flag')) {
          square.classList.add('flag')
        square.innerHTML = ' 🚩'
        flags++
        checkForWin()
        }
        else {
          square.classList.remove('flag')
          square.innerHTML = ''
          flags--
        }
        document.getElementById('flags-left').innerHTML = (20 - flags) + ""
      }
    }
  
    //click on square actions
    function click(square) {
      let numbers = ['one', 'two' , 'three', 'four', 'five', 'six', 'seven', 'eight']
      let currentId = square.id
      if (isGameOver) return
      if(square.classList.contains('checked') || square.classList.contains('flag'))  return
      
      if (square.classList.contains('bomb')) {
        clearInterval(myVar)
        result.classList.add('lose')
        result.innerHTML = "Game over"
        document.getElementById('restart').style.display = "inline-block"
        GameOver(square)
      } else {
        let total = square.getAttribute('data')
        if (total !=0) {
          square.classList.add('checked')
          square.classList.add(numbers[total-1])
          square.innerHTML = total
          return
        }
        checkSquare(square, currentId)
      }
      square.classList.add('checked')
    }
    function checkSquare(square, currentId){
      const isLeftEdge = (currentId % width === 0)
      const isRightEdge = (currentId % width === width -1)
      const isTopEdge = currentId <= 9
      const isBottomEdge = currentId >= 90
      
      setTimeout(() => {
        if (!isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isLeftEdge && !isTopEdge) {
          const newId = squares[parseInt(currentId) - 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isLeftEdge && !isBottomEdge) {
          const newId = squares[parseInt(currentId) - 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isRightEdge) {
          const newId = squares[parseInt(currentId) + 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isRightEdge && !isTopEdge) {
          const newId = squares[parseInt(currentId) + 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isRightEdge && !isBottomEdge) {
          const newId = squares[parseInt(currentId) + 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isTopEdge) {
          const newId = squares[parseInt(currentId) - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
  
  
        if (!isBottomEdge) {
          const newId = squares[parseInt(currentId) + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
      }, 10)
    }

    function GameOver(square) {
      isGameOver = true
      console.log('Game over!')
      squares.forEach(square => {
        if(square.classList.contains('bomb')){
          square.innerHTML = '💣'
        }
      })
    }


    function checkForWin() {
      let matches = 0
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('bomb') && squares[i].classList.contains('flag')) {
          matches++
        }
        if (matches == bombAmount) {
          clearInterval(myVar)
          console.log('BOOM YOU WON!')
          result.classList.add('win')
          result.innerHTML = "BOOM YOU WON!!!"
          document.getElementById('restart').style.display = "inline-block"
          return
        }
      }
    }  
  })
  
let time = 0

var myVar = setInterval(myTimer, 1000)
var timer = document.getElementById('time')
function myTimer() {
  const minutes = Math.floor(time / 60)
  let seconds = time % 60

  seconds = seconds < 10 ? '0' + seconds : seconds;

  timer.innerHTML = minutes + " : " + seconds
  time++
  
}

function reloadPage(){
  window.location.reload()
}

