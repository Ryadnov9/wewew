const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const img = new Image()


img.src = './flappy-bird-set.png'


// general sett 

let gamePlaying = false


const gravity = .5, 
  speed = 3.3, 
  size =[51, 36],
  jump = -11.5, 
  cTenth = canvas.width / 10 


let  index = 0, 
bestScore = 0, 
flight, 
flyHeight, 
currentScore, 
pipe, 
pipes 



// pipe

const pipeWidth = 78, 
pipeGap = 270, 
pipeLoc  = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth )) - pipeWidth )) + pipeWidth


const setup = () => {
  currentScore = 0 
  flight = jump


// set initial flyHeight
  flyHeight = (canvas.height / 2 ) - (size[1] / 2)

  
// setup first 3 pipes 

pipes = Array(3).fill().map((a, i) => [
  canvas.width + ( i * (pipeGap + pipeWidth)), pipeLoc()
] )

}



const render = () => { 
    
    // pipe and bird mov

index++ 

    // background first

ctx.drawImage( 
    img, 
    0,
    0, 
    canvas.width, 
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width, 
    0,
    canvas.width,
    canvas.height
)

//background second part 

ctx.drawImage( 
    img, 
    0,
    0, 
    canvas.width, 
    canvas.height,
    -(index * (speed / 2)) % canvas.width, 
    0,
    canvas.width,
    canvas.height
)

// pipe 

if(gamePlaying){ 

  pipes.map(pipe => {

    pipe[0] -= speed
    
    // top pipe 
    ctx.drawImage(
      img,
      432, 
      588 - pipe[1],
      pipeWidth, 
      pipe[1],
      pipe[0], 
      0, 
      pipeWidth, 
      pipe[1]
    )

    //bottom pipe 
    
    ctx.drawImage(
      img,
      432 + pipeWidth,
      108,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap,
      pipe[0],
      pipe[1] + pipeGap,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap
    )

    // give 1 pont & create new pipe 

    if(pipe[0] <= -pipeWidth){
      currentScore++

    bestScore = Math.max(bestScore, currentScore)

     //create new pipe 
    console.log(pipes[pipes.length -1][0])
       pipes = [
       ...pipes.slice(1),
       [pipes.at(-1)[0] + pipeGap + pipeWidth, pipeLoc()]
       ]
  }

  // if hit the pipe, end

  if(
    [
      pipe[0] <= cTenth + size[0],
      pipe[0] + pipeWidth >= cTenth, 
      pipe[1] > flyHeight || pipe [1] + pipeGap < flyHeight + size[1]
    ].every(elem => elem)
  ){
    gamePlaying = false
    setup()
  }

   
  
  })
}



//draw bird
if (gamePlaying) {

  ctx.drawImage(
    img,
    432,
    Math.floor((index % 9) / 3) * size[1],
    ...size,
    cTenth,
    flyHeight,
    ...size

  )

  flight += gravity
  flyHeight = Math.min(flyHeight + flight, canvas.height - size[1])
   
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      ((canvas.width / 2) - size[0] / 2),
      flyHeight,
      ...size
    );
    flyHeight = (canvas.height / 2) - (size[1] / 2)

    ctx.fillText(`Best score: ${bestScore}`, 85, 245)
    ctx.fillText('Click to play', 90, 535)
    ctx.font = "bold 30px courier "

    
  }
  
  document.getElementById('bestScore').innerHTML = `Best: ${bestScore}`
  document.getElementById('currentScore').innerHTML = `Current: ${currentScore}`
 



//animate
window.requestAnimationFrame(render)



}


let lastRenderTime = 0;
setup();
img.onload = () => {
  lastRenderTime = performance.now();
  window.requestAnimationFrame(render);
}



setup()
img.onload = render;

//start game

document.addEventListener('click' , () => gamePlaying = true)
window.onclick = () => flight = jump 



