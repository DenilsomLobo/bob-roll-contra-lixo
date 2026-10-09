/* Enemy art, predictable attacks, and placement on real collision surfaces. */
const ENEMY_ART={
 runner:{motion:'walk',frames:4,size:48,hp:3,name:'Sucata Rush'},
 guard:{motion:'idle',frames:3,size:48,hp:3,name:'Vigia Necro',shot:'guard-shot'},
 turret:{motion:'idle',frames:3,size:48,hp:5,name:'Torre Chorume',shot:'turret-shot'},
 heavy:{motion:'walk',frames:4,size:64,hp:9,name:'Tanque Entulho'},
 shooter:{motion:'walk',frames:4,size:48,hp:4,name:'Cuspidor Toxico',shot:'shooter-shot'},
 ambush:{motion:'walk',frames:4,size:48,hp:3,name:'Sucatum'}
};
const EnemySystem={
 preload(scene){for(const[type,art]of Object.entries(ENEMY_ART)){for(let i=1;i<=art.frames;i++)scene.load.image(`${type}-${art.motion}-${i}`,`assets/game-art/${type}-${art.motion}-${i}.png`);for(const pose of ['ready','attack'])scene.load.image(type+'-'+pose,`assets/game-art/${type}-${pose}.png`);if(art.shot)scene.load.image(art.shot,'assets/game-art/'+art.shot+'.png');}scene.load.image('checkpoint-flag','assets/game-art/checkpoint-flag.png');},
 create(scene){for(const[type,art]of Object.entries(ENEMY_ART))scene.anims.create({key:'enemy-'+type,frames:Array.from({length:art.frames},(_,i)=>({key:`${type}-${art.motion}-${i+1}`})),frameRate:type==='runner'?12:7,repeat:-1});},
 spawn(scene,type,x,y,index){
  const art=ENEMY_ART[type],key=art?`${type}-${art.motion}-1`:type==='flyer'?'asset-flyer-1':'asset-enemy';
  const e=scene.enemies.create(x,y,key).setScale(.25).setDepth(7);
  const bodyHeight=e.height*(['heavy','turret','basic','flyer'].includes(type)?.8:.62);
  e.body.setSize(e.width*.68,bodyHeight).setOffset(e.width*.16,e.height-bodyHeight-4);
  e.type=type;e.enemyName=art?.name||(type==='flyer'?'Drone Mosca':'Lixumbi');e.hp=art?.hp||2;e.activated=false;e.damaging=type!=='ambush';e.nextAttack=0;e.baseTint=0xffffff;e.dropWeapon=['Rapid','Spread','Laser'][index%3];e.home=x;e.homeY=y;e.direction=index%2?1:-1;e.phase='idle';e.poseUntil=0;
  if(type==='flyer'){e.body.allowGravity=false;e.play('flyer-hover');e.left=x-75;e.right=x+75;}
  else{
   const support=scene.platforms.getChildren().filter(p=>x>p.body.left+12&&x<p.body.right-12&&p.body.top>=y-10).sort((a,b)=>a.body.top-b.body.top)[0];
   if(!support)throw Error('Enemy without safe floor: '+type+' at '+x+','+y);
   e.y=support.body.top-e.displayHeight/2+1;e.body.updateFromGameObject();e.homeY=e.y;e.left=Math.max(support.body.left+e.displayWidth/2+4,x-100);e.right=Math.min(support.body.right-e.displayWidth/2-4,x+100);
   if(['guard','turret'].includes(type)){e.body.allowGravity=false;e.setImmovable(true);}
   e.play(art?'enemy-'+type:'enemy-walk');if(type==='ambush'){e.anims.stop();e.setTexture('ambush-ready');}
  }
  return e;
 },
 update(scene,time){
  const view=scene.cameras.main.worldView;
  for(const e of [...scene.enemies.getChildren()]){
   if(e.y>1165){e.destroy();continue;}
   const dx=scene.player.x-e.x,dy=scene.player.y-e.y;
   const visible=e.x>view.left+15&&e.x<view.right-15&&e.y>view.top-20&&e.y<view.bottom+20;
   if(!visible){e.setVelocity(0,0);e.nextAttack=time+1000;continue;}
   if(!e.activated&&Math.abs(dx)<260&&Math.abs(dy)<145){e.activated=true;e.nextAttack=time+(e.type==='ambush'?850:1100);if(e.type==='ambush'){e.phase='emerging';scene.notice('SUCATUM: CUIDADO COM O ENTULHO!');}}
   if(!e.activated)continue;
   e.setFlipX(dx<0);const moving=['basic','runner','heavy','shooter','ambush'].includes(e.type);
   let speed=0;if(e.type==='basic')speed=e.direction*32;if(e.type==='runner')speed=Math.sign(dx)*115;if(e.type==='heavy')speed=Math.sign(dx)*24;if(e.type==='shooter')speed=e.direction*28;if(e.type==='ambush'&&e.damaging)speed=Math.sign(dx)*85;
   if(moving){if(e.x<=e.left){e.x=e.left;e.direction=1;if(speed<0)speed=0;}if(e.x>=e.right){e.x=e.right;e.direction=-1;if(speed>0)speed=0;}e.setVelocityX(speed);}
   if(e.type==='flyer'){e.setVelocityX(e.x<e.left?35:e.x>e.right?-35:Math.sign(dx)*30);e.setVelocityY(Math.sin((time+e.home)/450)*35);}
   const windup=e.nextAttack-time<450&&time<e.nextAttack;
   if(e.type==='ambush'&&e.phase==='emerging'){e.damaging=false;if(time>=e.nextAttack){e.damaging=true;e.phase='idle';e.nextAttack=time+1700;}else{e.anims.stop();e.setTexture('ambush-ready');continue;}}
   if(time>=e.nextAttack){
    if(['guard','turret','shooter','flyer'].includes(e.type)){const a=Math.atan2(dy-4,dx);scene.enemyShot(e.x+Math.sign(dx)*e.displayWidth*.35,e.y-6,a,e.type==='turret'?165:150,ENEMY_ART[e.type]?.shot);}
    else if(e.type!=='basic'){e.setVelocityX(Math.sign(dx)*(e.type==='heavy'?55:155));}
    e.poseUntil=time+220;e.nextAttack=time+({turret:1900,guard:2200,shooter:1800,runner:1700,heavy:2300,ambush:1800,flyer:2100,basic:2400}[e.type]);
   }
   if(e.type==='basic'){e.play('enemy-walk',true);continue;}
   if(time<e.poseUntil||windup){e.anims.stop();e.setTexture(e.type==='flyer'?'asset-flyer-attack':e.type+(time<e.poseUntil?'-attack':'-ready'));if(windup&&moving)e.setVelocityX(0);}
   else e.play(e.type==='flyer'?'flyer-hover':'enemy-'+e.type,true);
  }
 }
};
