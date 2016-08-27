//1.绘制棋盘部分
var chess=document.getElementById('chess');
var context=chess.getContext('2d');
//绘制棋盘纵横线条
var drawChessBoard=function(){
    for(var i=0;i<15;i++){
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.moveTo(15,15+i*30);
	    context.lineTo(435,15+i*30);
    }
    context.stroke();
}
context.strokeStyle="#896C39";
window.onload=function(){
    drawChessBoard();
}

//绘制棋子
var me=true;//me表示当前棋子的颜色,true为黑色
var oneStep=function(i,j,me){
	context.beginPath();
    context.arc(15+i*30,15+j*30,12,0,2*Math.PI);
    context.closePath();
    //颜色渐变
    var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
    if(me){
        gradient.addColorStop(0,"black");
        gradient.addColorStop(1,"gray");
    }else{
    	gradient.addColorStop(0,"#BACAC6");
        gradient.addColorStop(1,"white");
    }
    context.fillStyle=gradient;
    context.fill();
}


//2.实现落子部分
var over=false;//表示棋局是否结束
var chessBoard=[];//存储棋盘上每一个交叉点的落子情况,为二维数组
//初始化
for(var i=0;i<15;i++){
	chessBoard[i]=[];
	for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
	}
}

chess.onclick=function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	//获取鼠标点击的位置
	var x=e.offsetX;
	var y=e.offsetY;
	//向下取整
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
	    oneStep(i,j,me);
	    chessBoard[i][j]=1;   
	    for(var k=0;k<count;k++){//遍历所有赢法
	    	if(wins[i][j][k]){
	    		    myWin[k]++;
	    		    computerWin[k]=6;//最大为5,6是一个异常情况，表示不可能再赢
	    	        if(myWin[k]==5){
	    	    	    window.alert("恭喜你赢啦");
	    	    	    over=true;
	    	    	}
	    	}	    	   	    	   
	    }	    
	    if(!over){
	    	me=!me;
	    	computerAI();//将变为白子，由电脑出
	    }
	}
}


//3.赢法数组,为三维数组
var wins=[];
//初始化
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
var count=0;//count中记录的是第几种赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;//所有横线赢法            
		}
		count++;
	}
}
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;//所有竖线赢法            
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;//所有斜线赢法            
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;//所有反斜线赢法            
		}
		count++;
	}
}


//4.赢法统计数组,为一维数组
var myWin=[];
var computerWin=[];
//初始化
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

var computerAI=function(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var u=0,v=0;
	//初始化
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
						    myScore[i][j]+=400;
						}else if(myWin[k]==3){
                            myScore[i][j]+=2000;
						}else if(myWin[k]==4){
                            myScore[i][j]+=10000;
						}
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
						    computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
                            computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
                            computerScore[i][j]+=20000;
						}
					}
				}
			}
			if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(myScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
			
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
	    	if(wins[u][v][k]){	    		
	    		    computerWin[k]++;
	    		    myWin[k]=6;//是一个异常情况，表示不可能再赢
	    	        if(computerWin[k]==5){
	    	    	    window.alert("啊哦，你输了哦");
	    	    	    over=true;
	    	    	}
	    	}
	}	    	   	    		    
	if(!over){
	    me=!me;
	}
}