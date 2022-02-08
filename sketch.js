var JOGAR= 1
var ENCERRAR= 0
var gamestate= JOGAR
var trex, trex_running, edges;
var groundImage;
var ground
var invisibleGround
var nuvemImg
var gameover
var restart
var gameoverImg
var restartImg
var pontuacao= 0
var deathSound, checkpoint, jumpSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  nuvemImg = loadImage("cloud.png")
  trex_collide = loadImage("trex_collided.png")
  gameoverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")

  cacto1= loadImage("obstacle1.png")
  cacto2= loadImage("obstacle2.png")
  cacto3= loadImage("obstacle3.png")
  cacto4= loadImage("obstacle4.png")
  cacto5= loadImage("obstacle5.png")
  cacto6= loadImage("obstacle6.png")

  jump= loadSound("jump.mp3")
  deathSound= loadSound("die.mp3")
  checkpoint= loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(600,200);
  
  
  //criando o trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  trex.addAnimation("trex_collided", trex_collide)
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
  trex.setCollider("circle",0,0,40)
  obstaclesGroup = new Group()
  nuvemGroup = new Group()

  //chao
  ground=createSprite(200,180,400,20)
  ground.addImage(groundImage)
  invisibleGround=createSprite(200,190,400,10)
  invisibleGround.visible=false

  gameover = createSprite(300,50);
  gameover.addImage(gameoverImg);
  gameover.visible= false

  restart = createSprite(300,120);
  restart.addImage(restartImg);
  restart.scale= 0.5
  restart.visible= false
}


function draw(){
  background(180);
  
  console.log("Isto e o "+ gamestate )

  if(gamestate== JOGAR){
    pontuacao= pontuacao + Math.round(frameRate()/60)
    if(keyDown("space")&& trex.y >= 160){
      trex.velocityY = -10;
      jump.play();
      
    }
    
   trex.velocityY = trex.velocityY + 0.5;



   ground.velocityX= -(2+ pontuacao /100)

   if(ground.x <0){
     ground.x= 200
    }
    nuvemRandom()
    gerarCactos()

    if(trex.isTouching(obstaclesGroup)){
      deathSound.play();
      gamestate= ENCERRAR
    }
  }
  else if(gamestate== ENCERRAR){
    trex.changeAnimation("trex_collided")
    ground.velocityX= 0
    obstaclesGroup.setVelocityXEach(0)
    nuvemGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    nuvemGroup.setLifetimeEach(-1)
    trex.velocityY= 0

    gameover.visible= true
    restart.visible= true

    if(mousePressedOver(restart)){

      reset()
    }
    }
  text("Pontos: "+ pontuacao,500,50)
 
  if(pontuacao > 0 && pontuacao% 100 == 0){
    checkpoint.play();
  }

  
 //impedir que o trex caia
  trex.collide(invisibleGround)


  

  drawSprites();
}

function nuvemRandom(){
 
  if(frameCount%60== 0){
    nuvem= createSprite(600,100,40,10)
    nuvem.velocityX= -(4+ pontuacao /100)
    nuvem.addImage(nuvemImg)
    nuvem.scale= 0.75
    nuvem.y= Math.round(random(25,85))
   nuvem.lifetime= 200
   nuvem.depth= trex.depth 
   trex.depth= trex.depth + 1
   nuvemGroup.add(nuvem)
  }


}

function gerarCactos(){

if(frameCount%60== 0){
  cacto= createSprite(600,165,10,40)
  cacto.velocityX= -(6+ pontuacao /100)
  var rand= Math.round(random (1,6))

  switch(rand){

    case 1: cacto.addImage(cacto1);  
    break
    case 2: cacto.addImage(cacto2);
    break
    case 3: cacto.addImage(cacto3);
    break
    case 4: cacto.addImage(cacto4);
    break
    case 5: cacto.addImage(cacto5);
    break
    case 6: cacto.addImage(cacto6);
    break
    default: break
  }
  cacto.scale= 0.65
  cacto.lifetime= 200
  obstaclesGroup.add(cacto)
}

}

function reset(){
  gamestate== JOGAR
  obstaclesGroup.destroyEach();
  nuvemGroup.destroyEach();

  
  pontuacao=0
  trex.changeAnimation("running", trex_running)
  gameover.visible=false
  restart.visible=false




}
