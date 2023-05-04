// <!--
// F84086105 傅瀚陞 第3次作業 5/2
// F84086105 HanShengFu The Third Homework 5/2
// -->

//網頁load完就開始
window.addEventListener( "load", start, false );

var Cards = Array(209);  //從index=1開始算四副撲克牌
var colors = ["spades","hearts","diamonds","clubs"] //撲克牌花色
var bet = 0;  //下注區的浮動金額
var gamebet = 0;  //Deal後進入21點的確定金額
var money = 200;  //一開始的資金
var dealercheatcheck = 0; //紀錄作弊選項開關
var playercheatcheck = 0;
var tablecount = 0; //紀錄table數量
var backpokercard ="<img class='pokers' id='cardback' src='./cardback_blue.png' alt='./cardback_blue.png'>";//拿卡背

//取撲克牌圖函式
function getCards(){
  var count = 0; 
  for (var c in colors){
    for (var i = 1; i <= 13; ++i) {
        for(var j = 0; j < 4;++j){
        count++;
        Cards[count] = "<img class='pokers' id='"+colors[c] + i + "' src='./poker/" + i + "_of_"+colors[c]+".png' alt='./poker/" + i + "_of_"+colors[c]+".png'>";
      }
    }
  }
}

//一開始想用來初始化的，但後來發現有reload能用，因此內部應有一些廢code
function intialscreen(){
  document.getElementById("intial").style.display = "block";
  document.getElementById("gameUI").style.display = "block";  
  document.getElementById("chipUI").style.display = "block";
  document.getElementById("chipimg").style.display = "block";
  document.getElementById("placebet").style.display = "block";
  document.getElementById("hint").style.display = "block";
  document.getElementById("main").style.display = "none";
  bet = 0;
  document.getElementById("mychips").innerHTML = bet;
  money = 200;
  document.getElementById("money").innerHTML = money;
  //取撲克牌圖
  getCards();
  Dealerpoint1=0;//A算11的狀況
  Dealerpoint2=0;//A算1的狀況
  Playerpoint1=0;//A算11的狀況
  Playerpoint2=0;//A算1的狀況
  document.getElementById("dealercards").innerHTML = "";
  document.getElementById("mycards").innerHTML = "";
  document.getElementById("dealerpoint").innerHTML = "";
  document.getElementById("mypoint").innerHTML = "";
}

//紀錄table用
function Recording(event){
  tablecount++;
  document.getElementById( "recordtable" ).innerHTML +=  "<tr id="+tablecount+"><td>"+tablecount+"</td>"+"<td>"+event+"</td></tr>"
  // table變色
  var row = document.getElementById(tablecount);
  row.style.backgroundColor = tablecount % 2 == 0 ? "rgb(156, 183, 184)" : "rgb(127, 224, 236)";
}

function startgame(){
  Recording("新玩家開始遊戲");
  document.getElementById("main").style.display = "block";
  document.getElementById("intial").style.display = "none";
  document.getElementById("gameUI").style.display = "none";
  
}


function start() {
  
  //初始化界面
  intialscreen()

  //OK and Start
  var Startgame = document.getElementById( "start" );
  Startgame.addEventListener("click", startgame, false);

  //莊家作弊按鈕，按下就開啟作弊模式
  var dealercheat = document.getElementById('dealercheat');
  dealercheat.addEventListener('change', function() {
    if (this.checked) {
      Recording("莊家作弊按鈕開");
      dealercheatcheck = 1;
    } else {
      Recording("莊家作弊按鈕關");
      dealercheatcheck = 0;
    }
  });

  //玩家作弊按鈕，按下就開啟作弊模式
  var playercheat = document.getElementById('playercheat');
  playercheat.addEventListener('change', function() {
    if (this.checked) {
      Recording("玩家作弊按鈕開");
      playercheatcheck = 1;
    } else {
      Recording("玩家作弊按鈕關");
      playercheatcheck = 0;
    }
  });


  //按下就重新整理網頁
  var Regame = document.getElementById( "Regame" );
  Regame.addEventListener("click", function() {
    location.reload();
  }, false);

  // var One = document.getElementById( "one" );
  var Ten = document.getElementById( "ten" );
  var Fifty = document.getElementById( "fifty" );
  var OneHundred = document.getElementById( "onehundred" );
  var FiveHundred = document.getElementById( "fivehundred" );
  var OneThousand = document.getElementById( "onethousand" );

  var Clear = document.getElementById( "clear" );
  var Deal = document.getElementById( "deal" );


  // 這是大陷阱!!，這樣寫會在點擊前直接執行函式並返回值!!要改用以下匿名函式，把PlaceBet改成其return的值 
  // Ten.addEventListener( "click", PlaceBet(10), false );  
  // One.addEventListener("click", function() { PlaceBet(1); }, false);
  Ten.addEventListener("click", function() { PlaceBet(10); }, false);
  Fifty.addEventListener("click", function() { PlaceBet(50); }, false);
  OneHundred.addEventListener("click", function() { PlaceBet(100); }, false);
  FiveHundred.addEventListener("click", function() { PlaceBet(500); }, false);
  OneThousand.addEventListener("click", function() { PlaceBet(1000); }, false);

  Deal.addEventListener("click",PushBet, false)
  Clear.addEventListener("click",function() { bet = 0; document.getElementById("mychips").innerHTML = bet }, false)

}

//選擇下注金額
function PlaceBet(value){
  
  //限制籌碼不超過資金
  if (value <= money - bet) {
    bet += parseInt(value); 
  }
  document.getElementById("mychips").innerHTML = bet ;
}

//確定下注金額，並關閉下注區，開啟21點遊戲程式
function PushBet(){
  if (bet != 0) {
    
    gamebet = bet ;
    money = money - gamebet;
    Recording("下注 "+bet);
    Recording("開始賭局");
    document.getElementById("money").innerHTML = money ;
    document.getElementById("hint").innerHTML= "資金 -"+gamebet+"，開始賭局";
    document.getElementById("chipimg").style.display = "none";
    document.getElementById("placebet").style.display = "none";
    document.getElementById("gameUI").style.display = "block";
    document.getElementById("mainbutton").style.display = "block";
    dealercheat.disabled = true;
    playercheat.disabled = true;
    Blackjack() //21點遊戲程式
  }
}

/*** 以下皆21點主遊戲相關程式 ***/

var Dealercolor=[];  //存出現過的花色
var Playercolor=[];  //存出現過的花色
var Dealernumber=[];  //存出現過的點數
var Playernumber=[];  //存出現過的點數
var Dealerpoint1=0;//A算11的狀況
var Dealerpoint2=0;//A算1的狀況
var Playerpoint1=0;//A算11的狀況
var Playerpoint2=0;//A算1的狀況

//21點遊戲程式
function Blackjack(){
  //先跑各抽兩張的函式
  var count = 0;
  var interval = setInterval(function() {
    if (count == 4) {
      clearInterval(interval); // 結束 setInterval
      return;
    }
    if (count%2 == 0){
      Dealer();
    }else{
      Player();
    }
    count++;
  }, 250);

  var Hit = document.getElementById( "Hit" );
  var Stand = document.getElementById( "Stand" );
  var Signal = document.getElementById( "Signal" );
  var Surrender = document.getElementById( "Surrender" );
  var Split = document.getElementById( "Split" );

  Hit.addEventListener( "click", Player, false );
  // Stand.addEventListener( "click", StandCard, false);
  Stand.addEventListener("click",StandB, false);
  Signal.addEventListener( "click", SignalBet, false);
  Surrender.addEventListener( "click", Surrendergame, false);
  Split.addEventListener( "click", SplitCard, false);
}

//用來存出現過的玩家卡圖片
var PlayerCardSet=[];
var DealerCardSet=[];
var SplitCardNumber1;
var SplitCardNumber2;
//首抽兩個數字一樣，可分牌
function SplitCard(){
  if (Playernumber.length == 2 && Playernumber[0] == Playernumber[1]) {
    if (money >= gamebet) {
      Recording("分牌");
      money -= gamebet;
      document.getElementById("hint").innerHTML = "您已分牌並加注，資金 -"+gamebet+"，先玩第一副!";
      document.getElementById("mycards").innerHTML =
      "<div id = 'leftcards' style= 'width: 50%; float: left;'>左邊的區塊</div>"+
      "<div id = 'rightcards' style= 'width: 50%; float: right;'>右邊的區塊</div>"

      console.log(Playernumber);
      document.getElementById("leftcards").innerHTML = PlayerCardSet[0];
      document.getElementById("rightcards").innerHTML = PlayerCardSet[1];
      SplitCardNumber1=Playernumber[0];
      SplitCardNumber2=Playernumber[1];

      //先第一副
      Playernumber = [];
      Playernumber[0] =  SplitCardNumber1;
      ({cardcolor,cardnumber} = DrawCard("leftcards")); //抓牌並顯示
      Playernumber.push(cardnumber);
      CalPlayer();  //算玩家牌的分數
      

      //爆掉或stand後換第二副
      //再第二副
      Playernumber = [];
      Playernumber[0] =  SplitCardNumber2;
      ({cardcolor,cardnumber} = DrawCard("rightcards")); //抓牌並顯示
      Playernumber.push(cardnumber);
      CalPlayer("secondpoint");  //算玩家牌的分數

      document.getElementById("hint").innerHTML = "此功能未完善，無法使用QQ，請按【好的】按鈕回去，不會扣你錢!"

      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet*3)>好的</button>";
      
    }else{
      document.getElementById("hint").innerHTML = "你錢不夠，不能分牌!";
    }
  }else{
    document.getElementById("hint").innerHTML = "兩張牌不同，現在不可split";
  }
}

//投降輸一半
function Surrendergame(){
  Recording("Surrender");
  gamebet /= 2;
  //要補莊家翻牌
  document.getElementById("hint").innerHTML = "你投降了你好爛!扣一半籌碼，歸回資金 -"+gamebet+" !";
  document.getElementById("mainbutton").style.display = "none"; 

  ShowFinalCard();
  document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet)>好的</button>";
}

//加注，多給一倍籌碼扣資金，然後抽一張牌並Stand
function SignalBet(){
  if(money >= gamebet){
    Recording("加注 "+gamebet);
    money -= gamebet;
    document.getElementById( "money" ).innerHTML =  money;
    document.getElementById( "hint" ).innerHTML =  "您已加注，資金 -"+gamebet;
    gamebet *= 2;
    document.getElementById( "mychips" ).innerHTML =  gamebet;
    var justonehit = 1;
    
    setTimeout(function() {
      Player(justonehit);
    }, 1000);
  }else{
    document.getElementById( "hint" ).innerHTML =  "你錢不夠，不能加注!";
  }

}
function StandB(){
  Recording("Stand");
  StandCard();
}

//不拿牌了，看莊家玩
function StandCard(){
  document.getElementById("hint").innerHTML = "換莊家的回合!";
  //Stand後不能再用按鈕
  document.getElementById("mainbutton").style.display = "none";

  //能按stand一定還沒爆牌，但因有bug發生，保險起見還是加個
  var Playerpoint;
  if (Playerpoint1 > 21) {
    Playerpoint = Playerpoint2;
  }else{
    Playerpoint = Playerpoint1 > Playerpoint2 ? Playerpoint1 : Playerpoint2;
  }
  
  document.getElementById("mypoint").innerHTML = Playerpoint;
  var Dealerpoint;

  var dealerInterval = setInterval(function() {
    if(Dealerpoint1 > 21){
      Dealerpoint = Dealerpoint2
    }else{
      Dealerpoint = Dealerpoint1 > Dealerpoint2 ? Dealerpoint1 : Dealerpoint2;
    }
    //還沒17要繼續翻牌
    if (Dealerpoint < 17) {
      document.getElementById("hint").innerHTML = "莊家拿牌!";
      Dealer();
    } else {
      clearInterval(dealerInterval);
      //延遲提示的顯示
      setTimeout(function() {
        StandCondition(Dealerpoint,Playerpoint);;
      }, 100);
    }
  }, 700);

}


function StandCondition(Dealerpoint,Playerpoint){
  if ((Dealerpoint == 21) && (Playerpoint != 21)) {
    document.getElementById("hint").innerHTML = "莊家21點，你輸了! 失去籌碼 !";
    Recording("莊家21點，輸了$"+gamebet)
    ShowFinalCard();
    document.getElementById("again").innerHTML = "<button onclick = BacktoBet(0)>好的</button>";

  }else if (Dealerpoint > 21){
    document.getElementById("hint").innerHTML = "莊家爆牌，你贏了! 資金 +"+gamebet*2+" !";
    Recording("莊家爆牌，贏了$"+gamebet)
    ShowFinalCard();
    document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet*2)>好的</button>";

  }else if(Playerpoint == 21){
    if (Dealerpoint == 21) {
      document.getElementById("hint").innerHTML = "雙方都21點，平手! 拿回籌碼，資金 +"+gamebet+" !";
      Recording("雙方皆21點平手")
      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet)>好的</button>";
    } else {
      document.getElementById("hint").innerHTML = "你21點，你贏了! 資金 +"+gamebet*2+" !";
      Recording("玩家21點，贏了$"+gamebet)
      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet*2)>好的</button>";
    }

  }else if(Dealerpoint < 21){

    if(Dealerpoint > Playerpoint){
      document.getElementById("hint").innerHTML = "莊家較大，你輸了! 失去籌碼!";
      Recording("玩家牌較小，輸了$"+gamebet)
      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(0)>好的</button>";

    }else if(Dealerpoint < Playerpoint){
      document.getElementById("hint").innerHTML = "你較大，你贏了! 資金 +"+gamebet*2+" !";
      Recording("玩家牌較大，贏了$"+gamebet)
      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet*2)>好的</button>";

    }else{
      document.getElementById("hint").innerHTML = "雙方大小一樣，平手! 歸還籌碼，資金 +"+gamebet+" !"
      Recording("雙方大小一樣平手")
      ShowFinalCard();
      document.getElementById("again").innerHTML = "<button onclick = BacktoBet(gamebet)>好的</button>";
    }
  }
}

//莊家抓牌
function Dealer(){
  ({cardcolor,cardnumber} = DrawCard("dealercards")); //抓牌並顯示

  if (DealerCardSet.length == 1) {
    Recording("莊家拿到第一張牌");
  }else{
    Recording("莊家拿到"+cardcolor+cardnumber);
  }
  
  Dealernumber.push(cardnumber);
  // console.log(Dealernumber)
  CalDealer();  //算莊家牌的分數
}

//玩家抓牌
function Player(justonehit){
  ({cardcolor,cardnumber} = DrawCard("mycards")); //抓牌並顯示
  Recording("玩家拿到"+cardcolor+cardnumber)
  Playernumber.push(cardnumber);
  CalPlayer();  //算玩家牌的分數
  
  setTimeout(function() {
    PlayerCardCondition(justonehit)
  }, 800);
}

function PlayerCardCondition(justonehit){
  if ((Playerpoint1 == 21 || Playerpoint2 == 21) ) {
    document.getElementById("hint").innerHTML = "你21點，換莊家了!";
    document.getElementById("mainbutton").style.display = "none";
    setTimeout(function() {
      StandCard();
    }, 1200);
  }
  else if(Playerpoint2 > 21){
    document.getElementById("hint").innerHTML = "你爆牌，你輸了! 失去籌碼!";
    Recording("我爆牌，輸了$"+gamebet)
    document.getElementById("mainbutton").style.display = "none";

    ShowFinalCard();
    document.getElementById("again").innerHTML = "<button onclick = BacktoBet(0)>好的</button>";

  }else if(justonehit == 1){  //Signal後只能抽一次，因此要直接進Stand
    justonehit = 0;
    document.getElementById("hint").innerHTML = "已加注並拿牌，換莊家了!";
    document.getElementById("mainbutton").style.display = "none";
    setTimeout(function() {
      StandCard();
    }, 1000);
    
  }
}

//結算並回到下注畫面
function BacktoBet(betchange){
  
  document.getElementById("intial").style.display = "none";
  document.getElementById("gameUI").style.display = "none";  
  document.getElementById("chipUI").style.display = "block";
  document.getElementById("chipimg").style.display = "block";
  document.getElementById("placebet").style.display = "block";
  document.getElementById("hint").style.display = "block";
  document.getElementById("main").style.display = "block";
  dealercheat.disabled = false;
  playercheat.disabled = false;
  bet = 0;
  document.getElementById("mychips").innerHTML = bet;
  money += betchange;  //要算輸贏
  document.getElementById("money").innerHTML = money;

  Recording("完成一局，目前資金: $" +money);
  //重置分數
  Dealerpoint1=0;//A算11的狀況
  Dealerpoint2=0;//A算1的狀況
  Playerpoint1=0;//A算11的狀況
  Playerpoint2=0;//A算1的狀況
  Dealernumber=[];
  Playernumber=[];
  DealerCardSet=[];
  PlayerCardSet=[]
  document.getElementById("dealercards").innerHTML = "";
  document.getElementById("mycards").innerHTML = "";
  document.getElementById("dealerpoint").innerHTML = "";
  document.getElementById("mypoint").innerHTML = "";
  document.getElementById("secondpoint").innerHTML = "";

  document.getElementById("mainbutton").style.display = "block";
  document.getElementById("Hit").style.display = "inline-block";
  document.getElementById("Stand").style.display = "inline-block";

  //重置牌桌
  document.getElementById("dealercards").innerHTML = "";
  document.getElementById("mycards").innerHTML = "";
  document.getElementById("again").innerHTML = "";
  document.getElementById("hint").innerHTML = "再來一局，請下注!"
  if(money < 10 ){

    if (money == 0) {
      Recording("破產")
      document.getElementById("hint").innerHTML = "你已破產，請離開賭場!或按開新遊戲重新開始!<br>也可選擇向此帳號匯錢以續關: 123454875278";
    }else{
      Recording("破產")
      document.getElementById("hint").innerHTML = "你已買不起籌碼，請離開賭場!或按開新遊戲重新開始!<br>也可選擇向此帳號匯錢以續關: 123454875278";
    }
    
    //不給再來，把東西都關了
    document.getElementById("again").innerHTML = "";
    document.getElementById("chipUI").innerHTML = "";
    document.getElementById("moneyUI").innerHTML = "";
    
    //crying banana cat彩蛋
    document.getElementById("egg").innerHTML = "<img  src='./banana-crying-cat.gif'>"
  }
}

//算莊家牌分數
function CalDealer(){
  Dealerpoint1 = 0;
  Dealerpoint2 = 0;
  if (Dealernumber.includes(1)) {
    for(var i = 0; i < Dealernumber.length ; ++i){

      if (Dealernumber[i] == 1) {
        Dealerpoint1+=11;
        Dealerpoint2+=1;
      }else if(Dealernumber[i] >= 10){
        Dealerpoint1+=10;
        Dealerpoint2+=10;
      }else{
        Dealerpoint1+=Dealernumber[i];
        Dealerpoint2+=Dealernumber[i];
      }
    }
  }else{
    for(var i = 0; i < Dealernumber.length ; ++i){

      if (Dealernumber[i] == 1) {
        Dealerpoint2+=1;
      }else if(Dealernumber[i] >=10){
        Dealerpoint2+=10;
      }else{
        Dealerpoint2+=Dealernumber[i];
      }
    }
  }

  //玩家作弊開啟能看莊家點數
  if (playercheatcheck == 1) {
    if(Dealerpoint1 !=0 && Dealerpoint1 < 21){
      document.getElementById("dealerpoint").innerHTML ="點數: "+ Dealerpoint1 +" 或 " + Dealerpoint2;
    }else if(Dealerpoint1 == 21){
      document.getElementById("dealerpoint").innerHTML ="點數: "+ Dealerpoint1;
    }else{
      document.getElementById("dealerpoint").innerHTML ="點數: "+ Dealerpoint2;
    }
  }

}

//算玩家牌分數
function CalPlayer(whosepoint = "mypoint"){
  Playerpoint1 = 0;
  Playerpoint2 = 0;
  if (Playernumber.includes(1)) {
    for(var i = 0; i < Playernumber.length ; ++i){

      if (Playernumber[i] == 1) {
        Playerpoint1+=11;
        Playerpoint2+=1;
      }else if(Playernumber[i] >= 10){
        Playerpoint1+=10;
        Playerpoint2+=10;
      }else{
        Playerpoint1+=Playernumber[i];
        Playerpoint2+=Playernumber[i];
      }
    }
  }else{
    for(var i = 0; i < Playernumber.length ; ++i){

      if (Playernumber[i] == 1) {
        Playerpoint2+=1;
      }else if(Playernumber[i] >=10){
        Playerpoint2+=10;
      }else{
        Playerpoint2+=Playernumber[i];
      }
    }
  }
  //處理兩個A出現的問題
  if (Playernumber.indexOf(1) !== -1 && Playernumber.indexOf(1, Playernumber.indexOf(1) + 1) !== -1) {
    console.log("數組中出現了兩個1");
    Playerpoint1 -= 10; //因為兩個A爆牌就不看了
  }
  
  if(Playerpoint1 !=0 && Playerpoint1 < 21){
    document.getElementById(whosepoint).innerHTML = Playerpoint1 +" or " + Playerpoint2;
    Recording("玩家點數: "+Playerpoint1 +" 或 " + Playerpoint2);
  }else if(Playerpoint1 == 21){
    document.getElementById(whosepoint).innerHTML = Playerpoint1;
    Recording("玩家點數: "+Playerpoint1);
  }else{
    document.getElementById(whosepoint).innerHTML = Playerpoint2;
    Recording("玩家點數: "+Playerpoint2);
  }
}

// var check = 0 ;
//抽牌並得到花色與數字
function DrawCard(whosecard)
{
  // check++;
  len = Cards.length - 1    //牌堆總共幾張，扣掉index=0的undefine
  
  if(len == 0){   //重新取牌  
    getCards()
    len = Cards.length - 1 
    alert("四副撲克牌已被抽光，正在重新洗牌，請繼續遊玩！");
  }

  var testDealerpoint = Dealerpoint1 > Dealerpoint2 ? Dealerpoint1 : Dealerpoint2;
  if(dealercheatcheck==1 && DealerCardSet.length >= 2 && whosecard == "dealercards" && testDealerpoint > 10 && testDealerpoint!=21){

    // 作弊抽牌，強制21點
    var testcardnumber = 0;
    targetnumber = 21 - testDealerpoint;
    var localcount = 0;
    while(testcardnumber != targetnumber){
      localcount++;
      number = Math.floor(  1 + Math.random() * len );
      testcard = Cards[number];
      var regex = /id='(\w+)'/; 
      var match = testcard.match(regex); 
      var id = match[1]; // ID內容
      testcardnumber = parseInt(id.match(/\d+/g)[0]); // 得到數字
      //怕牌堆已經沒有需要的牌了，會無限迴圈
      if (localcount == 30) {
        break;
      }
    }
    removed = Cards.splice(number, 1);  //移除作弊那張牌
    divElement = document.getElementById(whosecard);
    divElement.innerHTML += removed;  //丟到螢幕上
  
  }else{
    // 正常的隨機抽牌
    number = Math.floor(  1 + Math.random() * len );
    removed = Cards.splice(number, 1);  //移除抽到的牌
    divElement = document.getElementById(whosecard);
    divElement.innerHTML += removed;  //丟到螢幕上
  }


  //專為split服務，把出現過的玩家卡圖片存起來
  if (whosecard == "mycards"){
    PlayerCardSet.push(removed);
  }

  if (whosecard == "dealercards"){
    DealerCardSet.push(removed);
  }


  //取抽到的花色和數字
  imgElements = divElement.getElementsByTagName("img"); //得到的會是list
  imgElement = imgElements[imgElements.length - 1] //得到的會是list，要取最後面那個
  imgID = imgElement.id;

  //分解ID拿撲克牌資訊
  cardcolor = imgID.match(/[a-zA-Z]+/g)[0]; // 抓文字，match返回是list
  cardnumber = imgID.match(/\d+/g)[0]; // 抓數字

  //莊家第一張是卡背
  if (DealerCardSet.length == 1 && whosecard == "dealercards") {
    dealerfirstcardID = imgID;
    document.getElementById("dealercards").innerHTML = backpokercard;
  }
  
  //傳到算21點的程式裡面
  return{cardcolor:cardcolor, cardnumber:parseInt(cardnumber) }
}

var dealerfirstcardID="";

function ShowFinalCard(){
  document.getElementById("dealercards").innerHTML = "";
  for (var i in DealerCardSet) {
    document.getElementById("dealercards").innerHTML += DealerCardSet[i];
  }
  Recording("莊家翻開第一張牌為"+dealerfirstcardID);
  dealerfirstcardID = "";
  //遊戲結束顯示莊家點數
  if(Dealerpoint1 !=0 && Dealerpoint1 < 21){
    document.getElementById("dealerpoint").innerHTML = "點數: "+Dealerpoint1 +" 或 " + Dealerpoint2;
    Recording("莊家點數: "+Dealerpoint1 +" 或 " + Dealerpoint2)
  }else if(Dealerpoint1 == 21){
    document.getElementById("dealerpoint").innerHTML = "點數: "+Dealerpoint1;
    Recording("莊家點數: "+Dealerpoint1)
  }else{
    document.getElementById("dealerpoint").innerHTML = "點數: "+Dealerpoint2;
    Recording("莊家點數: " + Dealerpoint2)
  }
}

