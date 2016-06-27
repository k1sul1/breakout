class Pong {
  constructor(length){
    
    this.container = document.body;
    this.containerWidth = this.container.offsetWidth; 
    this.containerHeight = this.container.offsetHeight;

    this.fps = 60;
    this.transitionInProgress = false;  

    this.bricks = this.drawBricks(); 
    this.bar = this.drawPlayer(length); 
    this.ball = this.drawBall();

    this.top = this.containerHeight - 30; 
    this.left = (this.containerWidth - this.bar.offsetWidth) / 2; 

    this.bar.style.top = this.top + "px";
    this.bar.style.left = this.left + "px";

    this.bindControls();  
  }

  drawPlayer(length = 5){
    let bar = document.createElement("div");
    bar.className = "bar"; 

    for(let i = 0; i < length; i++){
      let part = document.createElement("div"); 
      part.className = "bar__part"; 

      bar.appendChild(part);
    }

    this.container.appendChild(bar);

    return bar; 

  }

  drawBricks(rows = 4, cols = 8){
    const areaWidth = this.containerWidth - 40;
    const areHeight = 400; 

    const brickArray = []; 
    const brickContainer = document.createElement("div"); 
    brickContainer.className = "brick-container"; 

    for(let rowIndex = 0; rowIndex < rows; rowIndex++){

      let row = document.createElement("div");

      row.classList.add("row");
      row.style.position = "relative";

      for(let colIndex = 0; colIndex < cols; colIndex++){
        let brick = document.createElement("span");

        brick.classList.add("brick");
        brick.style.left = 100 / cols * colIndex + "%";
        brick.style.width = 100 / cols + "%";

        row.appendChild(brick);
        brickArray.push(brick);
      }

      brickContainer.appendChild(row);
    }

    
    this.container.appendChild(brickContainer); 

    return brickArray;
  }

  drawBall(){
    let ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.top = "200px";
    ball.style.left = this.containerWidth / 2 + "px";

    ball.momentum = 0; 
    ball.angle = 0; 

    this.container.appendChild(ball);

    return ball; 
  }

  moveBall(){
    const ball = this.ball; 


    if(ball.momentum <= 0){
      // ball is falling
      ball.style.top = (parseInt(ball.style.top, 10) + 10) + "px";
    }

    else if(ball.momentum > 0){
      // ball is going up
      ball.style.top = (parseInt(ball.style.top, 10) - 10) + "px";
    }

    if(ball.angle !== 0){
      let leftValue = 360 / ball.angle; // YEEEEEES, BASIC PHYSICS
      ball.style.left = parseInt(ball.style.left, 10) - leftValue + "px";
    } 


    // run "hit" checks

    let ballPos = ball.getBoundingClientRect();

    this.bricks.forEach(brick => {
      let brickPos = brick.getBoundingClientRect();

      if(ballPos.top >= brickPos.top && 
        ballPos.top <= (brickPos.top + brick.offsetHeight) && 

        ballPos.left >= brickPos.left && 
        ballPos.left <= (brickPos.left + brick.offsetWidth)
      ){
        // trigger a hit
        //console.log("Brick hit!");
        ball.momentum = 0;

        if(!brick.classList.contains("damaged")){
          brick.classList.add("damaged");
        }

        else{
          brick.parentNode.removeChild(brick);
        }
      }

    });

    //if(ballPos.top < 0 || ballPos.left < 0 || ballPos.left > this.containerWidth){
    if(ballPos.top <= 0 || 
      //ballPos.top <= (playerPos.top + this.bar.offsetHeight) && 

      ballPos.left <= 0 ||
      ballPos.left >= this.containerWidth  
    ){
      // wall hit, adjust the angle and momentum, return to stop going further
      //ball.momentum = 0;
      ball.angle = -ball.angle
    }


    let playerPos = this.bar.getBoundingClientRect();
    if(ballPos.top >= playerPos.top && 
      ballPos.top <= (playerPos.top + this.bar.offsetHeight) && 

      ballPos.left >= playerPos.left && 
      ballPos.left <= (playerPos.left + this.bar.offsetWidth)
    ){
      //console.log("Player hit");
      ball.momentum = 1;
      ball.angle = 45;
    }
  }

  bindControls(){
  
  	this.keydown = {};

    const onKeydown = e => {
      this.keydown[e.which] = true;
    }

    const onKeyup = e => {
      this.keydown[e.which] = false;
    }

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
    
  }

  move(dir){
    const allowed = ["up", "down", "left", "right"];
    
    console.clear(); 
    console.log(this.keydown);
    
    if(allowed.indexOf(dir) !== -1){     

      switch(dir){
        case "up": 
          this.top = this.top - 10; 
        break; 

        case "down": 
          this.top = this.top + 10; 
        break; 

        case "left": 
          this.left = this.left - 10; 
        break; 

        case "right": 
          this.left = this.left + 10; 
        break; 
      }
    } 
    
    else{
      throw Error("Lol what.");
    }

  }

  render(){
  
  	if(this.keydown['37'] === true){
      this.move("left")
    }

    if(this.keydown['38'] === true){
      this.move("up")
    }

    if(this.keydown['39'] === true){
      this.move("right")
    }

    if(this.keydown['40'] === true){
      this.move("down")
    }


    this.bar.style.top = this.top + "px"; 
    this.bar.style.left = this.left + "px";
    
    //this.keydown = {};
    
    this.moveBall();
    
    
    requestAnimationFrame(() => {
      this.render();
    });


  }

  reset(){

  }

}

const Game = new Pong();
Game.render();

