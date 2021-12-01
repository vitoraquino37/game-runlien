ground = {
    y: 412,
    h: 100,
    draw: function(){
        ctx.fillStyle = "purple";
        ctx.fillRect(0, this.y, canvas.width, this.h);
    }
},


ceiling = {
    y: 0,
    h: 100,
    draw: function(){
        ctx.fillStyle = "purple";
        ctx.fillRect(0, this.y, canvas.width, this.h);       
    }
},



block = {
   
    x: 512,

    vel: 5,

    cor: ['red', 'lightgreen', 'lightblue', 'white', 'orange'],

    alturas: [50, 100, 120, 130],
    larguras: [30, 90, 120, 45,],
    yindex : 0,
    index : 0,
    vindex : 0,
    alt: 0,
    larg: 0,

    random: function (){
        this.x = 512;
        this.yindex = Math.floor(Math.random() * 2);

        this.index = Math.floor(Math.random() * 4);

        this.alt=Math.floor(Math.random() * 3);
        this.larg= Math.floor(Math.random() * 3);

        controlePoint = 1;
    },
    
    //alt e larg sao os indices dos vetores de alturas e larguras
    update: function () {
        speed = this.vel;
        this.x -= speed;
        
    },


    draw: function () {
        this.ys = [100, 412 - this.alturas[this.alt]];
        this.y = this.ys[this.yindex];
        ctx.fillStyle = this.cor[this.index];
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.larguras[this.larg], this.alturas[this.alt]);
        controleBlock = 1;
    },

},

power = {
    x : -40,

    y : Math.floor((Math.random() * 250) + 1) + 100,
   
    distanciaBlock : 0, //distancia do bloco para o power

    vaiPower : 0, //vai aparecer para ser coletado ou não
    
    cor: "yellow",

    size: 10,

    random: function (){
        this.distanciaBlock = Math.floor((Math.random() * 400) + 1) + block.larguras[block.larg];
        this.vaiPower = Math.floor((Math.random() * 10) + 1);
        this.y = Math.floor((Math.random() * 270) + 1) + 115;
        this.x = block.x + this.distanciaBlock;
    },
    
    //alt e larg sao os indices dos vetores de alturas e larguras
    update: function () {
        speed = block.vel;
        this.x -= speed;
        
    },


    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.arc(this.x, this.y, this.size, 0, 2 * 3.14);
        ctx.fill();
    },

},

ball = {
    y:ceiling.h,
    x:120,
    width:20,
    height: 32,
    size: 20,
    g: 2,
    v: 0,
    up: 20,

    jump: function(){
        ball.g*=-1;
        ball.up=0;;
        this.v =- this.up;
    },
    update: function(){
        this.v += this.g;
        this.y += this.v;
        if(this.y > ground.y - this.height)        
            this.y = ground.y - this.height;          
         else if(this.y < ceiling.h)
            this.y = ceiling.h;            
        document.getElementById("score").innerHTML = point;

        //colisao com o Bloco
        //compara o eixo X
        console.log();
        if((this.x + this.width >= block.x) && (this.x + this.width <= block.x + block.larguras[block.larg])){
            if((this.y >= block.y && this.y <= block.y + block.alturas[block.alt]) || (this.y + this.height >= block.y && this.y + this.height <= block.y + block.alturas[block.alt])){
                document.getElementById("somBlock").play();
                if(destruirBlock == true){
                    voltarPowerBlock();
                    point+=3;
                }else{
                    gameOver = true;
                    //texto.random();
                    document.addEventListener("mousedown", parabens);
                }                
               
            }
        }
        if(this.x + this.width > block.larguras[block.larg] && controlePoint == 1){
            point++;
            controlePoint = 0;
        }

        //colisao com power
        if((this.x + this.width >= power.x - power.size) && (this.x + this.width <= power.x + power.size) || (this.x >= power.x - power.size) && (this.x <= power.x + power.size)){
            
            if((this.y >= power.y - power.size && this.y <= power.y + power.size) || (this.y + this.height >= power.y - power.size && this.y + this.height <= power.y + power.size)){
                document.getElementById("somPower").play();
                point+=5;
                console.log("colidiuPower");
                powerColetados++;
                power.x = -40;
            }
        }
    },

    draw: function(){
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width,this.height);
        
        if(this.y > 250){
            voltarPlayer();
        }else{
            mudarPlayer();
        }
        
    },
}

texto = {
    y : 150,
    x : 600,
    index: 0,
    speed : 5,
    credits: ["Muito bem!", "Vitor Aquino", "TOP", "Alegria"],

    update: function(){
        this.x -= this.speed;
    },

    random: function(){
        this.x = 600;
        this.y = Math.floor((Math.random() * 200) + 1) + 150;
        this.index = Math.floor((Math.random() * 3) + 1);
    },

    draw: function(){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillText(this.credits[this.index], this.x, this.y);
    },
}

//variaveis globais
menu = true;
ganhou = false;
gameOver = false;
usandoPower = false;
powerColetados = 0;
powerBarra = 0;
controleBlock = 0;
controlePoint = 0;
point = 0;
playPiscando = 0;
destruirBlock = false;
vitoria = 10; //distancia em segundos para ganhar
distPercorrida = 0; //distancia percorrida
aumentarVel = 0; //gatilho para aumentar a velocidade
contPower = 3; //quantidade necessaria para ativar o power

window.onload = function () {
    controleBlock = 1;
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");     
    setInterval(update, 1000 / 30);   
    document.addEventListener("mousedown", click);

    vitoria = vitoria * 100;
}

//update principal
function update() {
    
    document.getElementById("somFundo").play();

    draw();    
    ceiling.draw();  
    ground.draw();    
    

    if(menu == true){
        
        voltarPlayer();
        document.getElementById("play").style.visibility = "visible";
        document.addEventListener("mousedown", play);
        
        playerCentro();

        document.getElementById("play").style.marginLeft = 215;        

        tirarHUD();

    }else if(ganhou == true){

        voltarPlayer();
        document.getElementById("play").innerHTML = "CONGRATULATIONS!!!";
        document.getElementById("play").style.visibility = "visible";
        document.getElementById("play").style.marginLeft = 75;
        
        playerCentro();

        texto.draw();
        texto.update();

        if(texto.x < -150){
            texto.random();
        }

    }else if(gameOver == true){

        console.log("passou game over");
        voltarPlayer();
        document.getElementById("play").innerHTML = "GAME OVER";
        document.getElementById("play").style.visibility = "visible";
        document.addEventListener("mousedown", parabens);
        document.getElementById("play").style.marginLeft = 160;

        playerCentro();

        texto.draw();
        texto.update();

        if(texto.x < -150){
            texto.random();
        }

    }else{
        //gameplay

        colocarHUD();

        distPercorrida++;

        document.getElementById("ui-dis").style.width = distPercorrida / (vitoria / 400);

        document.getElementById("play").style.visibility = "hidden";
        ball.draw();
        ball.update();
        block.draw();
        block.update();

        //posiciona o player
        if(ball.y < 250){
            document.getElementById("playerFora").style.marginTop = ball.y - 475;
            if(usandoPower == true){
                document.getElementById("playerFora").style.marginLeft = ball.x + 14;
                document.getElementById("playerFora").style.marginTop = (ball.y - 475) -6;
            }else{
                document.getElementById("playerFora").style.marginLeft = ball.x;
            }
        }else{
            if(usandoPower == true){
                document.getElementById("playerFora").style.marginTop = ball.y - 485;
            }else{
                document.getElementById("playerFora").style.marginTop = ball.y - 475;
            }
            document.getElementById("playerFora").style.marginLeft = ball.x;
        }

        //trata o power
        if(usandoPower == false){
            document.getElementById("ui-barra").style.width = (powerColetados * 205) / contPower;
            power.draw();
            power.update();
            destruirBlock = false;
        }else{
            document.getElementById("ui-barra").style.width = powerBarra;
            powerBarra-=1;
            destruirBlock = true;
            
        }

        if(powerBarra < 0){
            usandoPower = false;
            powerBarra = 0;
    
            ball.width = 20;
            ball.height = 32;
            document.getElementById("player").src = "image/player.gif";

            document.getElementById("somFundo").playbackRate = 1.0;
        }

        if(powerColetados >= contPower){
            usandoPower = true;
            powerColetados = 0;
            powerBarra = 205;
    
            ball.width = 34;
            ball.height = 18;
            document.getElementById("player").src = "image/playerDeLado.gif";

            document.getElementById("somFundo").playbackRate = 1.5;
        }
    
        //faz os blocos passarem novamente
        if(block.x + block.larguras[block.larg] < 0 && controleBlock == 1){
            block.random();
            controleBlock = 0;
            power.vaiPower++;
        }
    
        //faz o power passar novamente
        if(power.x < 0 && power.vaiPower == 2){
            power.random();
            power.vaiPower = 0;
        }

        //condição de vitoria
        if(distPercorrida >= vitoria){
            ganhou = true;
            menu = false;
            perdeu = false;
            document.addEventListener("mousedown", parabens);
            document.getElementById("somFundo").playbackRate = 1.0;
        }

        //faz o controle para aumentar a velocidade
        if(block.vel < 20){
        aumentarVel++;

        if(aumentarVel >= 200){
            block.vel ++;
            aumentarVel = 0;
        }
    }

    }
   
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
}

function click() {
    document.getElementById("somJump").play();
    ball.jump();
}

function play(){
    menu = false;
    point = 0;
    block.vel = 5;
    distPercorrida = 0;
    powerBarra = 0;
    powerColetados = 0;

    document.getElementById("somJump").play();

    document.addEventListener("mousedown", click);
    
    //desabilita os clicks
    document.removeEventListener("mousedown", play);

    console.log("entrou play");
}

//funcao para game over e ganhou
function parabens(){
    if(ganhou == true){
        ganhou = false;
        menu = true;
        powerBarra = 0;
        powerColetados = 0;
        distPercorrida = 0;

        document.getElementById("somJump").play();

        document.getElementById("play").innerHTML = "PLAY";

        voltarPowerBlock();

        //desabilita os clicks
        document.removeEventListener("mousedown", click);
        document.removeEventListener("mousedown", parabens);

        document.getElementById("player").src = "image/player.gif";

    }else if(gameOver == true){
        document.removeEventListener("mousedown", parabens);
        gameOver = false;
        menu = true;
        powerBarra = 0;

        document.getElementById("somJump").play();

        document.getElementById("play").innerHTML = "PLAY";
    
        voltarPowerBlock();

        //desabilita os clicks
        document.removeEventListener("mousedown", click);
    }
    
}

function voltarPowerBlock(){
    //volta o bloco e o power
    block.random();
    controleBlock = 0;
    power.random();
    power.vaiPower = 0;
}

function mudarPlayer(){
    document.getElementById("player").style.transform = "scaleX(-1)";
    document.getElementById("playerFora").style.transform = "rotate(180deg)";
}
function voltarPlayer(){
    document.getElementById("player").style.transform = "scaleX(1)";
    document.getElementById("playerFora").style.transform = "rotate(0deg)";
}

function tirarHUD(){
    document.getElementById("power").style.visibility = "hidden";
    document.getElementById("ui-life").style.visibility = "hidden";
    document.getElementById("score1").style.visibility = "hidden";
    document.getElementById("score").style.visibility = "hidden";
    document.getElementById("ui-borDis").style.visibility = "hidden";
    document.getElementById("ui-dis").style.visibility = "hidden";
}

function colocarHUD(){
    document.getElementById("power").style.visibility = "visible";
    document.getElementById("ui-life").style.visibility = "visible";
    document.getElementById("score1").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    document.getElementById("ui-borDis").style.visibility = "visible";
    document.getElementById("ui-dis").style.visibility = "visible";
}

//posiciona o player para as telas de game over, ganhou e menu
function playerCentro(){
    document.getElementById("playerFora").style.marginLeft = 250;
    document.getElementById("playerFora").style.marginTop = -200;
}