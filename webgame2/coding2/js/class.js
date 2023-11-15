class Stage{
    constructor(){//생성자
        this.level= 0;
        this.isStart= false;
        //this.stageStart();
    }
    // stageStart(){
    //     setTimeout(()=>{
    //         this.isStart= true;
    //         this.stageGuide(`START Lv.${this.level +1}`);
    //         this.callMonster();
    //     }, 2000);//clear한 뒤 2초 뒤에 다음 스테이지 시작
    // }
    stageGuide(text){
        this.parentNode= document.querySelector('.game_app');
        this.textBox= document.createElement('div');
        this.textBox.className= 'stage_box';
        this.textNode= document.createTextNode(text);
        this.textBox.appendChild(this.textNode);
        this.parentNode.appendChild(this.textBox);

        setTimeout(()=> this.textBox.remove(), 1500);
    }
    callMonster(){
        //allMonsterComProp.arr[0]= new Monster(pinkMonBoss, gameProp.screenWidth +700);//몬스터 타입, 생성 위치
        //allMonsterComProp.arr[1]= new Monster(yellowMonBoss, gameProp.screenWidth +1400);
        //allMonsterComProp.arr[2]= new Monster(greenMonBoss, gameProp.screenWidth +2100);

        for(let i=0; i <=10; i++){//몬스터 반복 생성 조건
            if(i ===10){//10마리 생성 후 보스 생성
                allMonsterComProp.arr[i]= new Monster(stageInfo.monster[this.level].bossMon, hero.movex +gameProp.screenWidth +600 *i);
            }else{//디폴트 몬스터
                allMonsterComProp.arr[i]= new Monster(stageInfo.monster[this.level].defaultMon, hero.movex +gameProp.screenWidth +700 *i);
            }   
        }
    }
    clearCheck(){
        stageInfo.callPosition.forEach(arr=>{
            if(hero.movex >=arr && allMonsterComProp.arr.length=== 0){//캐릭터의 위치가 몬스터 생성위치보다 크고 이전 몬스터를 다 죽였을때
                this.stageGuide(`START Lv.${this.level +1}`);
                stageInfo.callPosition.shift();//배열의 첫번째부터 삭제: 다음 몬스터가 생성될때 이전 몬스터도 같이 생성되지 않도록
                setTimeout(()=>{
                    this.callMonster();
                this.level ++;
                }, 1000)
            }
        })
        // if(allMonsterComProp.arr.length=== 0 && this.isStart){//몬스터가 다 죽으면
        //     this.isStart= false;
        //     this.level++;//다음 레벨
        //     if(this.level <stageInfo.monster.length){//지정한 stage까지만 게임이 반복되도록
        //         this.stageGuide('CLEAR');
        //         this.stageStart();//다음 스테이지 시작
        //         hero.heroUpgrade();
        //     }else{//stage가 다 끝나면
        //         this.stageGuide('YOU WON!');
        //     }
        // }
    }
}

class Hero {
	constructor(el){
		this.el = document.querySelector(el);
        this.movex= 0;//캐릭터 이동거리
        this.speed= 11;
        this.direction= 'right';//캐릭터가 바라보는 기본 방향
        this.attackDamage= 10000;
        this.hpProgress= 0;//캐릭터의 hp%
        this.hpValue= 100000;//캐릭터의 hp
        this.defaultHpValue= this.hpValue;
        this.realDamage= 0;//캐릭터의 데미지 조정을 위해 담을 변수
        this.slideSpeed= 14;
        this.slideTime= 0;
        this.slideMaxTime= 30;
        this.slideDown= false;
        this.level= 1;
        this.exp= 0;
        this.maxExp= 3000;//레벨업 조건
        this.expProgress= 0;//exp백분율
	}
	keyMotion(){//움직임 설정
		if(key.keyDown['left']){
            this.direction= 'left';
			this.el.classList.add('run');//run class 추가
			this.el.classList.add('flip');//방향 전환

            this.movex= this.movex<=0 ? 0 : this.movex - this.speed;//왼쪽 화면 끝에서 막히도록
		}else if(key.keyDown['right']){
            this.direction= 'right';
			this.el.classList.add('run');
			this.el.classList.remove('flip');

            this.movex= this.movex + this.speed;
		}

		if(key.keyDown['attack']){
            if(!bulletComProp.launch){//launch가 false일 때 인스턴스 추가
                this.el.classList.add('attack');
                bulletComProp.arr.push(new Bullet());//배열로 추가
                bulletComProp.launch= true;//하나만 생성 되도록
            }
		}

        if(key.keyDown['slide']){
            if(!this.slideDown){
                this.el.classList.add('slide');
            if(this.direction=== 'right'){
                this.movex= this.movex +this.slideSpeed;
            }else{
                this.movex= this.movex -this.slideSpeed;
            }
            if(this.slideTime >this.slideMaxTime){//slide시간 제한
                this.el.classList.remove('slide');
                this.slideDown= true;//slide가 종료되도록
            }
            this.slideTime+= 1;//slide가 눌리면 시간을 추가
            }
        }

		if(!key.keyDown['left'] && !key.keyDown['right']){
			this.el.classList.remove('run');//방향키를 뗴면 대기동작
		}

		if(!key.keyDown['attack']){
			this.el.classList.remove('attack');
            bulletComProp.launch= false;//무기가 다시 나가도록
		}

        if(!key.keyDown['slide']){
            this.el.classList.remove('slide');
            this.slideDown= false;//slide를 다시 사용할 수 있게
            this.slideTime= 0;//slideTime초기화
        }

        this.el.parentNode.style.transform= `translateX(${this.movex}px)`;
	}
    position(){//위치 메소드
        return{
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight -this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }

    }
    size(){
        return{
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        }
    }
    minusHp(monsterDamage){
        this.hpValue= Math.max(0, this.hpValue -monsterDamage);//0까지만 깎이도록
        this.crash();
        if(this.hpValue=== 0){
            this.dead();
        }
        this.renderHp();
    }
    plusHp(hp){
        this.hpValue= hp;
        this.renderHp();
    }
    renderHp(){//hp변경
        this.hpProgress= this.hpValue /this.defaultHpValue *100
        const heroHpBox= document.querySelector('.state_box .hp span');
        heroHpBox.style.width= this.hpProgress +'%';
    }
    crash(){//캐릭터 충돌
        this.el.classList.add('crash');//충돌 이미지
        setTimeout(()=> this.el.classList.remove('crash'), 300);//0.3초 뒤에 이미지 종료
    }
    dead(){//캐릭터 사망
        hero.el.classList.add('dead');
        endGame();
    }
    hitDamage(){
        this.realDamage= this.attackDamage -Math.round(Math.random() *this.attackDamage *0.1);//공격력 조정
    }
    heroUpgrade(){//캐릭터의 능력치 증가
        //this.speed +=1.3;
        this.attackDamage +=5000;
    }
    updateExp(exp){
        this.exp+= exp;
        this.expProgress= this.exp /this.maxExp *100;//exp백분율
        document.querySelector('.hero_state .exp span').style.width= this.expProgress +'%';
        
        if(this.exp >=this.maxExp){//레벨업 조건
            this.levelUp();
        }
    }
    levelUp(){
        this.level+= 1;
        this.exp= 0;//exp초기화
        this.maxExp= this.maxExp +this.level *1000;//level에 따라 맥스exp 증가
        document.querySelector('.level_box strong').innerText= this.level;//상태박스에 레벨 상승 표시
        const levelGuide= document.querySelector('.hero_box .level_up');
        levelGuide.classList.add('active');//레벨업 애니
        setTimeout(()=> levelGuide.classList.remove('active'), 1000);
        this.updateExp(this.exp);
        this.heroUpgrade();//능력향상
        this.plusHp(this.defaultHpValue);//체력 회복
    }
}

class Bullet{
    constructor(){
        this.parentNode= document.querySelector('.game');
        this.el= document.createElement('div');
        this.el.className= 'hero_bullet';
        this.x= 0;//무기 위치
        this.y= 0;
        this.speed= 20;
        this.distance= 0;
        this.bulletDirection= 'right';//무기의 방향
        this.init();

    }
    init(){
        this.bulletDirection= hero.direction=== 'left' ? 'left' : 'right';//캐릭터의 방향에 따라 무기의 방향 설정
        this.x= this.bulletDirection==='right' ? hero.movex + hero.size().width /2 : hero.movex - hero.size().width /2;
        this.y= hero.position().bottom - hero.size().height /2;
        this.distance= this.x;
        this.el.style.transform= `translate(${this.x}px, ${this.y}px)`;
        this.parentNode.appendChild(this.el);
    }
    moveBullet(){
        let setRotate= '';
        if(this.bulletDirection=== 'left'){
            this.distance -= this.speed;
            setRotate= 'rotate(180deg)';
        }else{
            this.distance += this.speed;
        }
        
        this.el.style.transform= `translate(${this.distance}px, ${this.y}px) ${setRotate}`; 
        this.crashBullet();
    }
    position(){//위치 메소드
        return{
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight -this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    crashBullet(){//무기 제거
        for(let j= 0; j <allMonsterComProp.arr.length; j++){//몬스터의 수만큼 반복확인
            if(this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right){//몬스터와 무기가 양 옆에 닿았을 때
                for(let i= 0; i <bulletComProp.arr.length; i++){//무기 배열의 반복문을 멈추기 위해
                    if(bulletComProp.arr[i]=== this){//배열의 i번째와 충돌한 무기 요소가 같다면 배열에서 삭제
                        hero.hitDamage();
                        bulletComProp.arr.splice(i, 1);
                        this.el.remove();
                        this.damageView(allMonsterComProp.arr[j]);//충돌한 몬스터의 인스턴스를 넘겨줌
                        allMonsterComProp.arr[j].updateHp(j);
                    }
                }
            }
        }
        

        if(this.position().left > gameProp.screenWidth || this.position().right< 0){//화면 밖으로 나갔을 때
            for(let i= 0; i <bulletComProp.arr.length; i++){
                if(bulletComProp.arr[i]=== this){
                    bulletComProp.arr.splice(i, 1);
                    this.el.remove();
                }
            }
        }
    }
    damageView(monster){//무기&몬스터 충돌 애니
        this.parentNode= document.querySelector('.game_app');
        this.textDamageNode= document.createElement('div');
        this.textDamageNode.className= 'text_damage';
        this.textDamage= document.createTextNode(hero.realDamage);
        this.textDamageNode.appendChild(this.textDamage);
        this.parentNode.appendChild(this.textDamageNode);
        let textPosition= Math.random() * -100;//데미지값 위치 랜덤 배정
        let damagex= monster.position().left + textPosition;//무기와 충돌했을 때 위치값
        let damagey= monster.position().top;
        this.textDamageNode.style.transform= `translate(${damagex}px, ${-damagey}px)`;
        setTimeout(()=> this.textDamageNode.remove(), 500);//쌓이는 데미지 element를 지워줌
    }
}

class Monster{
    constructor(property, positionX){//몬스터 종류의 속성을 매개변수로 받아온다
        this.parentNode= document.querySelector('.game');
        this.el= document.createElement('div');
        this.el.className= 'monster_box ' +property.name;
        this.elChildren= document.createElement('div');
        this.elChildren.className= 'monster';
        this.hpNode= document.createElement('div');
        this.hpNode.className= 'hp';
        this.hpValue= property.hpValue;
        this.defaultHpValue= property.hpValue;//몬스터 최초 hp
        this.hpInner= document.createElement('span');
        this.progress= 0;//몬스터 hp percent변수
        this.positionX= positionX;
        this.moveX= 0;//몬스터 이동거리
        this.speed= property.speed;
        this.crashDamage= property.crashDamage;//몬스터와 캐릭터 충돌 데미지
        this.score= property.score;//몬스터 처치 경험치
        this.exp= property.exp;
        this.init();
    }
    init(){
        this.hpNode.appendChild(this.hpInner);
        this.el.appendChild(this.hpNode);
        this.el.appendChild(this.elChildren);
        this.parentNode.appendChild(this.el);
        this.el.style.left= this.positionX +'px';
    }
    position(){//위치 메소드
        return{
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight -this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    updateHp(index){//몬스터 체력(j값을 index로 받음)
        this.hpValue= Math.max(0, this.hpValue -hero.realDamage);
        this.progress= this.hpValue /this.defaultHpValue *100;
        this.el.children[0].children[0].style.width= this.progress +'%';//hp% 표현

        if(this.hpValue=== 0){
            this.dead(index);
        }
    }
    dead(index){
        this.el.classList.add('remove');
        setTimeout(()=> this.el.remove(), 200);//서서히 사라지게(0.2초)
        allMonsterComProp.arr.splice(index, 1);//배열에서 삭제하여 성능문제 해결
        this.setScore();//몬스터가 죽을 때 경험치 추가
        this.setExp();
    }
    moveMonster(){
        if(this.moveX +this.positionX +this.el.offsetWidth +hero.position().left -hero.movex <=0){//몬스터가 왼쪽 화면 밖을 나갔을때
            this.moveX= hero.movex -this.positionX +gameProp.screenWidth -hero.position().left;//오른쪽 화면에서 재생성
        }else{
            this.moveX -= this.speed;
        }

        this.el.style.transform= `translateX(${this.moveX}px)`;
        this.crash();//이동할 때마다 충돌했는지 확인
    }
    crash(){//캐릭터와 몬스터 충돌
        let rightDiff= 30;//box의 여백을 30px만큼 줄임
        let leftDiff= 90;
        if(hero.position().right -rightDiff >this.position().left && hero.position().left +leftDiff <this.position().right){//캐릭터와 몬스의 box가 겹치는 구간
            hero.minusHp(this.crashDamage);//crashDamage를 캐릭터hp로 보내줌
        }
    }
    setScore(){//경험치 받기
        stageInfo.totalScore +=this.score;//처치할 때마다 경험치 추가
        document.querySelector('.score_box').innerText= stageInfo.totalScore;//화면에 경험치 표현
    }
    setExp(){
        hero.updateExp(this.exp);//hero에 exp 전달
    }
}



