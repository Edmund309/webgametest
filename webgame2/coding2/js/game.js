const key= {//방향키
    keyDown:{},
    keyValue:{
        37:'left',
        39:'right',
        88:'slide',
        67:'attack'
    }
}

const allMonsterComProp={
    arr: []
}

const bulletComProp={//무기 인스턴스 담는 곳 
    launch: false,
    arr: []
}

const GameBackground={
    gameBox: document.querySelector('.game')
}

const stageInfo={
    stage: [],
    totalScore:0,
    monster: [//stage별 몬스터 종류
        {defaultMon: greenMon, bossMon: greenMonBoss},//lv.1
        {defaultMon: yellowMon, bossMon: yellowMonBoss},//lv.2
        {defaultMon: pinkMon, bossMon: pinkMonBoss},//lv.3
        {defaultMon: greenMon, bossMon: greenMonBoss},
        {defaultMon: yellowMon, bossMon: yellowMonBoss},
        {defaultMon: pinkMon, bossMon: pinkMonBoss},
        {defaultMon: greenMon, bossMon: greenMonBoss},
        {defaultMon: yellowMon, bossMon: yellowMonBoss},
        {defaultMon: pinkMon, bossMon: pinkMonBoss}
    ],
    callPosition: [1000, 5000, 9000, 13000, 17000, 21000, 24000, 27000, 30000]//캐릭터가 1000만큼 이동 했을 때 생성
}

const gameProp={
     screenWidth: window.innerWidth,
     screenHeight: window.innerHeight,
     gameOver: false
}

const renderGame= () =>{//(무한반복)  
    hero.keyMotion();//키눌림 딜레이 해결 
    setGameBackground();

    bulletComProp.arr.forEach((arr, i)=>{
        arr.moveBullet();//배열의 길이만큼 반복->무기 이동
    });

    allMonsterComProp.arr.forEach((arr, i)=>{
        arr.moveMonster();
    });

    stageInfo.stage.clearCheck();
    window.requestAnimationFrame(renderGame);//재귀호출 
}

const endGame=()=>{//게임이 끝났을 경우
    gameProp.gameOver= true;//windowevent애서 true를 넘기면 방향키가 안먹도록
    key.keyDown.left= false;//강제로 false 입력
    key.keyDown.right= false;
    document.querySelector('.game_over').classList.add('active');
}

const setGameBackground=()=>{
    let parallaxValue= Math.min(0, (hero.movex -gameProp.screenWidth /3) * -1);//pallaxValue>0 ==0(배경 픽스), pallaxValue<0 == -값 /캐릭터가 중간에 왔을 떄 배경 이동
    GameBackground.gameBox.style.transform=`translateX(${parallaxValue}px)`//캐릭터가 이동하는 데로 배경이미지 설정
}

const windowEvent= () =>{//key, 이벤트 동작 관리 함수
    window.addEventListener('keydown', e =>{ //키 동작
        if(!gameProp.gameOver) key.keyDown[key.keyValue[e.which]]= true;
    });

    window.addEventListener('keyup', e =>{
        key.keyDown[key.keyValue[e.which]]= false;
    });

    window.addEventListener('resize', e =>{//다양한 화면에 적용될 수 있게
        gameProp.screenWidth= window.innerWidth;
        gameProp.screenHeight= window.innerHeight;
    });
}

const loadImg=()=>{//이미지가 로드되면서 끊기는걸 방지하기 위해 미리 로드
    const preLoadImgSrc=['../../lib2/images/char/char_attack.png', '../../lib2/images/char/char_run3.png']
    preLoadImgSrc.forEach(arr=>{//배열에 있는 이미지가 반복되는 반복문
        const img= new Image();
        img.src= arr;
    });
}

let hero;

const init= () =>{ //프로그램 실행
    hero= new Hero('.hero');
    stageInfo.stage= new Stage();

    loadImg();//화면 시작과 함께 이미지를 미리 로드
    windowEvent();
    renderGame();
    console.log(hero.position());
}

window.onload= () =>{//init 전에 요소 먼저 로드
    init();
}

