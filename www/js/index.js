/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();




/* MY CODE HERE */var stp=0;var gameover,playagain,taptoplay;
localStorage.highscore=0;


var level=-1.5;


var myGamePiece;
var myObstacle=[];
var myBackground;
var myScore;
var score=0;
var scoreUpdater=[];
var myLevel;
var rocket=[];

var X=$(window).width();
var Y=$(window).height();


var myGameArea={             // Its the game area consistin of a canvas element and start function.....
    canvas: document.createElement("canvas"),

    start: function(){
        this.canvas.width=$(window).width();//100%;//window.innerwidth;
        this.canvas.height=$(window).height();//100%;//window.innerheight;
        this.context=this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas,document.body.childNodes[0]);        // ?????????????????????????????

        this.frameno=0;

        this.interval=setInterval(updateGameArea,20);


    },

    clear: function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);


    }
}

function calx(a){
    return (a*360)/480;
}

function caly(b){
    return (b*600)/270;
}
// Play audio
//
function playAudio(url) {
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function (err) {
            console.log("playAudio():Audio Error: " + err);
        }
    );
    // Play audio
    my_media.play();
}

function startGame(){
    myGamePiece = new component(193*0.25,161*0.25,"img/superman.png",10,120,"imagec");  /*67*1.6*/  /*14*1.6*/  //  width,height,color,position.....super3.png...50/20
    myBackground = new component(1500,800,"img/backspace.png",0,0,"background");
    myScore = new component("30px","Consolas","purple",5,25,"text");   //X-170,25
    myLevel = new component("30px","Consolas","purple",X-140,25,"text");
    mySound = new sound("sounds/burst.mp3");
    mysnd = new sound("sounds/score.wav");
    //var media = new Media("sounds/burst.mp3", onSuccess, onError);// [mediaStatus]);

    //scoreUpdater[0] = new component(62.7*0.8,36.8*0.8,"img/scoreupdater.png",90,153,"image");
    //rocket[0] = new component(52,76,"img/rocket.png",50,50,"image");

    //myObstacle[0] = new component(10,400,"red",calx(300),caly(120),"n");
    myGameArea.start();   // adds canvas element and inserts it as first childnode of <body> element.....
}




function component(width,height,color,x,y,type)
{
    this.type=type; 

    if(type=="image" || type=="background" || type=="imagec")
    {
        this.image = new Image();
        this.image.src=color;
    }

    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.speedY=0;
    this.speedX=0;
    
    this.update=function()
    {
        ctx=myGameArea.context;
        
        if(this.type=="text")
        {
        ctx.font=this.width+" "+this.height;
        ctx.fillStyle=color;
        ctx.fillText(this.text,this.x,this.y);
        }
    

        if(this.type=="image" || this.type=="background" || this.type=="imagec")
        {   
           /* if(this.image.src=="img/rocket.png")                //?????????????????????????????????????????????????
            {
                this.image.src="img/rocketflip.png";
            }*/

            

            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            if(this.type=="background")
            {   //ctx.scale(-1,1);
            ctx.drawImage(this.image,this.x+this.width,this.y,this.width,this.height);
               // ctx.scale(-1,1);
            }
        }
        else
        {   ctx.fillStyle=color;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    }

    this.newPos=function()
    {
        if(this.type=="imagec")// && this.image.src=="super3.png")
        {
            if(this.x<0 || this.y<0 || this.x>X-this.width || this.y>Y-this.height)
            {
                if(this.x<0)
                    this.x=this.x+1;
                else if(this.y<0)
                    this.y=this.y+1;
                else if(this.x>X-this.width)
                    this.x-=1;
                else
                    this.y-=1;
                return;
            }
        }
        this.x+=this.speedX;
        this.y+=this.speedY;



        if(this.type=="background")
        {
            if(this.x==-(this.width))
            {
                this.x=0;


            }
        }


    }

    this.crashwith=function(otherobj)
    {
        var crash=true;
        if((this.x+this.width<otherobj.x)||(this.y+this.height<otherobj.y)||(this.x>otherobj.x+otherobj.width)||(this.y>otherobj.y+otherobj.height))
            crash=false;
        return crash;
    }
    
}

function everyinterval(n){
    if((myGameArea.frameno/n)%1==0) return true;
    return false;
}



function updateGameArea()
{   var minheight,maxheight,gap,height,mingap,maxgap;

   /* for(k=0;k<scoreUpdater.length;k++)
    {
        if(myGamePiece.crashwith(scoreUpdater[k]))
        {
            score+=5;
            scoreUpdater.pop();

            if(score%10==0)
            {
                level-=0.5;                       // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
            }
        }
        
    }*/



    if(scoreUpdater.length!=0 && myGamePiece.crashwith(scoreUpdater[scoreUpdater.length-1]))
        {
            //playAudio("sounds/score.wav");  
            mysnd.play();          
            score+=5;
            scoreUpdater.pop();
            if(score!=0 && score%20==0)
            {
                level-=0.5;                       // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
            }
            
        }


    if(rocket.length!=0)
    {
    var f=rocket.length-1;
    if(myGamePiece.crashwith(rocket[f]))
    {

        if(rocket[f].width!=74.5){
            score+=5;
            mySound.play();
            //media.play();
            //playAudio("sounds/burst.mp3");
            if(score!=0 && score%20==0)
            {
                level-=0.5;                       // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
            }
        }
        rocket[f].width=74.5;//298*0.25;
            rocket[f].height=71.25;//285*0.25;
            rocket[f].y-=0;
            rocket[f].image.src="img/splash_sh.png";


    }
    }

    

   /* for(i=0;i<myObstacle.length;i++)
    {
        if(myGamePiece.crashwith(myObstacle[i])) 
        {   document.getElementById("a").style.visibility='hidden';

            document.getElementById("b").style.visibility='hidden';
            document.getElementById("c").style.visibility='hidden';
            document.getElementById("d").style.visibility='hidden';
            document.getElementById("swipe").style.visibility='hidden';


            stp=1;
            gameover = new component(320*0.9,343*0.9,"img/gover.png",(X-320*0.9)/2,20,"image");   //10,40    2x+wid=X
            gameover.update();
            playagain = new component(51.2*2,51.2*2,"img/play.png",(X-51.2*2)/2,Y-51.2*2-30,"image");   //118,453    2x+wid=X
            playagain.update();
            taptoplay = new component("30px","Consolas","purple",(X-170)/2,Y-10,"text");  // 88,577
            taptoplay.text="Play again";
            taptoplay.update();
            exit = new component(51.2*1.3,51.2*1.3,"img/exit.png",X-51.2*1.3-20,70*Y/100,"image");  //268,423
            exit.update();

            menupic = new component(51.2*1.3,51.2*1.3,"img/menu.png",20,70*Y/100,"image");   //12,423
            menupic.update();
            menu = new component("30px","Consolas","purple",20,85*Y/100,"text");   //12,517
            menu.text="Menu";
            menu.update();


            


           // myGameArea.stop();

           // gameover.update();
           /* var canv=document.createElement("canvas");
            var cont=canv.getContext("2d");
            canv.width=320;
            canv.height=343;
            var img = new Image();
            cont.img.src="img/gover.png";
            cont.drawImage(cont.img,0,0,320,343);*/
            /*return;
        }
    }*/

    if(myObstacle.length!=0 && (myGamePiece.crashwith(myObstacle[myObstacle.length-1]) || myGamePiece.crashwith(myObstacle[myObstacle.length-2])))
        {   document.getElementById("a").style.visibility='hidden';

            document.getElementById("b").style.visibility='hidden';
            document.getElementById("c").style.visibility='hidden';
            document.getElementById("d").style.visibility='hidden';
            document.getElementById("swipe").style.visibility='hidden';


            stp=1;
            gameover = new component(320*0.9,343*0.9,"img/gover.png",(X-320*0.9)/2,20,"image");   //10,40    2x+wid=X
            gameover.update();
            playagain = new component(51.2*2,51.2*2,"img/play.png",(X-51.2*2)/2,Y-51.2*2-30,"image");   //118,453    2x+wid=X
            playagain.update();
            taptoplay = new component("30px","Consolas","purple",(X-170)/2,Y-10,"text");  // 88,577
            taptoplay.text="Play again";
            taptoplay.update();
            exit = new component(51.2*1.3,51.2*1.3,"img/exit.png",X-51.2*1.3-20,70*Y/100,"image");  //268,423
            exit.update();

            menupic = new component(51.2*1.3,51.2*1.3,"img/menu.png",20,70*Y/100,"image");   //12,423
            menupic.update();
            menu = new component("30px","Consolas","purple",20,85*Y/100,"text");   //12,517
            menu.text="Menu";
            menu.update();
            return;
        }

    myGameArea.clear();

    myBackground.speedX=-0.5;
    myBackground.newPos();
    myBackground.update();
    
    myGameArea.frameno+=1;

    if(myGameArea.frameno==1 || myObstacle[myObstacle.length-1].x<-10)//everyinterval(150))    //150
    {   
    	var clrs=['red','blue','yellow','green','pink','orange'];

    	var n = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];



        x=myGameArea.canvas.width;
        y=myGameArea.canvas.height;
        minheight=70;maxheight=400;
        height=Math.floor(Math.random()*(maxheight-minheight+1)+minheight);         /* +1 is added to acheive max height in case of max. output from random()
                                                                                       +minheight is added to acheive minheight in case of min. output i.e. 0 from random() */
        mingap=80;maxgap=200;
        gap=Math.floor(Math.random()*(maxgap-mingap+1)+mingap);
        myObstacle.push(new component(10,height,n[Math.floor(Math.random()*n.length)],x,0));
        myObstacle.push(new component(10,y-height-gap,n[Math.floor(Math.random()*n.length)],x,height+gap));   //320

        scoreUpdater.push(new component(62.7*0.8,36.8*0.8,"img/scoreupdater.png",225,Math.floor(Math.random()*Y/2) + Y/4+1,"image"));//cla..300....cal...200
        //rposy=[0,616-76];
        //rocket.push(new component(52,76,"img/rocket.png",360/2+52/2,rposy[Math.floor(Math.random()*rposy.length)],"image"));
        if(myGameArea.frameno==1)
        {rocket.push(new component(76,52,"img/rocket_01.png",X-20,Math.floor(Math.random()*(Y-2*52) + 52),"image"));}
        else
        {

            rocket.push(new component(76,52,"img/rocket_h.png",X-40,Math.floor(Math.random()*(Y-2*52) + 52),"image"));   // X/2+52/2,0
        }
        
        //rocket.push(new component(52,76,"img/rocket.png",myObstacle[myObstacle.length-2].x-(myObstacle[myObstacle.length-4].x+10)-52/2,76,"image"));
    }
    /*if(everyinterval(200))
    {
         
    }*/

    /*for(i=0;i<myObstacle.length;i++)
    {
        myObstacle[i].x+=level;                  // LEVEL   !!!!  !!!!  !!!!  !!!!  !!!!  !!!!
        myObstacle[i].update();
    }*/

    myObstacle[myObstacle.length-1].x+=level;                  // LEVEL   !!!!  !!!!  !!!!  !!!!  !!!!  !!!!
    myObstacle[myObstacle.length-1].update();
    myObstacle[myObstacle.length-2].x+=level;                  // LEVEL   !!!!  !!!!  !!!!  !!!!  !!!!  !!!!
    myObstacle[myObstacle.length-2].update();
    
    /*for(i=0;i<scoreUpdater.length;i++)
    {
        scoreUpdater[i].x+=level;
        scoreUpdater[i].update();
    }*/
    if(scoreUpdater.length!=0){
    scoreUpdater[scoreUpdater.length-1].x+=level;
    scoreUpdater[scoreUpdater.length-1].update();}


    /*for(i=0;i<rocket.length;i++)
    {  
        rocket[i].x-=2.4;//level;

        //rocket[i].y-=0;//level; 
                
        rocket[i].update();
    }*/

    rocket[rocket.length-1].x-=-level+1;//2.4;
    rocket[rocket.length-1].update();


    myScore.text="Score:"+score;
    myLevel.text="Level:"+((-1.5-level)/0.5+1);                   // -1-0.5x=level.......where x+1 is actual level......x+1=(1-level)/0.2+1
    myScore.update();
    myLevel.update();

    myGamePiece.newPos();
    myGamePiece.update();

   

    
        
}




function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function place_in_gap(){
    //if(!stop){
        var y=(myObstacle[myObstacle.length-2].y+myObstacle[myObstacle.length-2].height-myObstacle[myObstacle.length-1].y)/-2+(myObstacle[myObstacle.length-2].height)-myGamePiece.height/2;
                                //myGamePiece.x=x;
                                myGamePiece.y=y;
                                            //document.getElementById("p").innerHTML=y;

                                myGamePiece.update();
    //}
}


function hitRocket(event)
{
    var x=event.clientX;
    var y=event.clientY;
    //document.getElementById("p").innerHTML="called!!!..."+x+"    "+y;
    var i = rocket.length-1;
    
        if(!(x<rocket[i].x || x>rocket[i].x+rocket[i].width || y<rocket[i].y || y>rocket[i].y+rocket[i].height) && rocket[i].width!=74.5)
        {
            score+=5;
            if(score!=0 && score%20==0)
            {
                level-=0.5;                       // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
            }
            rocket[i].width=74.5;//298*0.25;
            rocket[i].height=71.25;//285*0.25;
            rocket[i].y-=5;
            rocket[i].image.src="img/splash_sh.png";
            mySound.play();
            //media.play();
            //playAudio("sounds/burst.mp3");
            //document.getElementById("p").innerHTML="hit";
           // $(rocket[i]).animate({top:'600px'});
        }

        if(stp)
        {   
        	if(!(x<playagain.x || x>playagain.x+playagain.width || y<playagain.y || y>playagain.y+playagain.height))
            location.reload();

            if(!(x<exit.x || x>exit.x+exit.width || y<exit.y || y>exit.y+exit.height))
			{
				//if(score>localStorage.highscore || 1)localStorage.highscore=score;
				navigator.app.exitApp(); 
			}      

			if(!(x<menupic.x || x>menupic.x+menupic.width || y<menupic.y || y>menupic.y+menupic.height))
			{
				window.location.assign("index.html");
			}    
		}

    
};

/*$("body").on("swipeleft",function(){
    $("p").hide();
    $(myGamePiece).animate({top:'0px'},slow);
});*/

 /*$(function() {           
                    //Enable swiping...
                    $("#swipe").swipe( {
                        //Generic swipe handler for all directions
                        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                            //alert("You swiped " + direction);
                             //var x=event.clientX;
    //var y=event.clientY;

                            if((direction=="up" || direction=="down") && !stp)
                            {
                            	//var x=myObstacle[myObstacle.length-2].;
                            	var y=(myObstacle[myObstacle.length-2].y+myObstacle[myObstacle.length-2].height-myObstacle[myObstacle.length-1].y)/-2+(myObstacle[myObstacle.length-2].height)-myGamePiece.height/2;
                            	//myGamePiece.x=x;
                            	myGamePiece.y=y;
                            	            //document.getElementById("p").innerHTML=y;

                            	myGamePiece.update();
                            }
                            /*if(stp)
        					{   if(!(x<playagain.x || x>playagain.x+playagain.width || y<playagain.y || y>playagain.y+playagain.height))
            						location.reload();
       						 }*/
                            


                        /*},
                        //Default is 75px, set to 0 for demo so any distance triggers swipe
                       threshold:0
                    });
                });*/

 