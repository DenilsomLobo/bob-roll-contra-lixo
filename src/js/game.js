/* Bob Roll - Contra o lixo. Original mission, deterministic enemy patterns. */
const sound={enabled:true,ctx:null,unlock(){this.ctx ||= new(window.AudioContext||window.webkitAudioContext)();this.ctx.resume();},play(name){if(!this.enabled||!this.ctx)return;const notes={shot:[760,210,.045],jump:[210,650,.12],death:[240,35,.4],pickup:[480,1200,.22],explosion:[110,24,.22],hit:[170,70,.1],enemy:[320,90,.12],boss:[90,190,.4],transition:[440,880,.35]};const[a,b,d]=notes[name]||notes.shot,now=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=name==='pickup'?'triangle':'square';o.frequency.setValueAtTime(a,now);o.frequency.exponentialRampToValueAtTime(b,now+d);g.gain.setValueAtTime(.045,now);g.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(g);g.connect(this.ctx.destination);o.start(now);o.stop(now+d);}};
document.querySelector('#sound').onclick=e=>{sound.enabled=!sound.enabled;e.target.textContent=`SOM: ${sound.enabled?'ON':'OFF'}`;};
const WEAPONS={Rifle:{rate:190,damage:1,speed:580,color:0xffffff},Spread:{rate:310,damage:1,speed:510,color:0xffcf83},Rapid:{rate:80,damage:1,speed:650,color:0x8afaff},Laser:{rate:320,damage:4,speed:850,color:0xff9dff}};
const STYLE={resolution:2,fontFamily:'monospace',fontSize:'12px',color:'#e5efd8'};
class Mission extends Phaser.Scene{
 constructor(){super('mission');}
 preload(){Ending.preload(this);EnemySystem.preload(this);this.load.on('loaderror',file=>{const error=document.querySelector('#error');if(error){error.hidden=false;error.textContent=`Falha ao carregar ${file.key}. Confira os placeholders em assets.`;}});const files={'asset-player':'game-art/bob-idle.png','asset-player-run-1':'game-art/bob-run-1.png','asset-player-run-2':'game-art/bob-run-2.png','asset-player-crouch':'game-art/bob-crouch.png','asset-enemy':'game-art/enemy-walk-1.png','asset-enemy-frame':'game-art/enemy-walk-2.png','asset-boss':'game-art/boss-idle-1.png','asset-bullet':'game-art/bob-shot.png','asset-hostile':'game-art/slime-shot.png','asset-platform':'game-art/platform.png','asset-background':'game-art/factory-background.png'};for(const weapon of Object.keys(WEAPONS)){files['powerup-'+weapon]='game-art/powerup-'+weapon.toLowerCase()+'.png';files['shot-'+weapon]='game-art/shot-'+weapon.toLowerCase()+'.png';}for(const name of ['ground-metal','ground-slime','beam','girder','pillar','bracket','tower'])files['platform-'+name]='game-art/platform-'+name+'.png';files['lava-pit']='game-art/lava-pit.png';for(const name of ['boss-static-neutral','boss-static-mouth','boss-static-attack','boss-toxic-shot','checkpoint-neutral'])files[name]='game-art/'+name+'.png';files['asset-player-jump']='game-art/bob-jump.png';for(let i=3;i<=6;i++)files['asset-player-run-'+i]='game-art/bob-run-'+i+'.png';for(let i=3;i<=4;i++)files['asset-enemy-frame-'+i]='game-art/enemy-walk-'+i+'.png';for(let i=2;i<=3;i++)files['asset-boss-frame-'+i]='game-art/boss-idle-'+i+'.png';files['asset-boss-attack']='game-art/boss-attack.png';for(let i=1;i<=4;i++)files['asset-flyer-'+i]='game-art/flyer-hover-'+i+'.png';files['asset-flyer-attack']='game-art/flyer-attack.png';for(const[key,file]of Object.entries(files))this.load.image(key,'assets/'+file);}
 create(){
  EnemySystem.create(this);Ending.create(this);
  this.anims.create({key:'walk',frames:Array.from({length:6},(_,i)=>({key:'asset-player-run-'+(i+1)})),frameRate:10,repeat:-1});
  this.anims.create({key:'idle',frames:[{key:'asset-player'}],frameRate:1,repeat:-1});
  this.anims.create({key:'enemy-walk',frames:[{key:'asset-enemy'},{key:'asset-enemy-frame'},{key:'asset-enemy-frame-3'},{key:'asset-enemy-frame-4'}],frameRate:6,repeat:-1});
  this.anims.create({key:'boss-idle',frames:[{key:'boss-static-neutral'},{key:'boss-static-neutral'},{key:'boss-static-mouth'},{key:'boss-static-neutral'}],frameRate:3,repeat:-1});this.anims.create({key:'flyer-hover',frames:Array.from({length:4},(_,i)=>({key:'asset-flyer-'+(i+1)})),frameRate:8,repeat:-1});const gen=(key,w,h,draw)=>{if(this.textures.exists(key))return;const g=this.add.graphics();draw(g);g.generateTexture(key,w,h);g.destroy();};
  gen('asset-background',960,540,g=>{
   g.fillStyle(0x13262f).fillRect(0,0,960,540);
   g.fillStyle(0x1d3940);
   [[0,140,150,170],[170,75,160,235],[350,165,205,175],[575,55,155,285],[750,120,210,220]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
   g.fillStyle(0x315758);
   [[32,182,24,35],[84,182,24,35],[201,129,30,42],[263,129,30,42],[201,207,30,42],[263,207,30,42],[382,232,32,42],[442,232,32,42],[629,98,28,37],[684,98,28,37],[629,166,28,37],[684,166,28,37],[812,212,32,42],[874,212,32,42]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
   g.fillStyle(0xe8a74b).fillRect(170,162,160,9).fillRect(575,210,155,9);
   g.fillStyle(0x69b8bb).fillRect(0,332,960,22);
   g.fillStyle(0x293f3c).fillRect(0,354,960,186);
   g.fillStyle(0x477779).fillRect(0,393,960,7).fillRect(0,461,960,5);
   g.fillStyle(0x83d48b).fillRect(73,365,36,28).fillRect(455,390,51,35).fillRect(697,373,30,21);
   g.fillStyle(0xe8a74b).fillRect(120,444,43,29).fillRect(700,462,48,32);
   g.fillStyle(0xa9d978).fillRect(816,374,18,18).fillRect(284,467,18,18);
  });
  document.querySelector('#pilot-entry').hidden=false;this.elapsed=0;this.rankSaved=false;resetTouch();this.mode='title';this.lives=5;this.health=3;this.maxHealth=3;this.score=0;this.weapon='Rifle';this.facing=1;this.nextShot=0;this.invincible=0;this.checkpoint={x:90,y:1020,name:'ENTRADA'};this.lastGround=-1000;this.jumpBuffer=0;this.lastJump=false;this.bossStarted=false;this.bossBeat=0;
  this.physics.world.setBounds(0,0,4100,1200);this.cameras.main.setBounds(0,0,4100,1200).setBackgroundColor('#101b25').setZoom(2);
  this.add.tileSprite(2050,600,4100,1200,'asset-background').setTileScale(960 / this.textures.get('asset-background').getSourceImage().width).setAlpha(.95);
  const deco=this.add.graphics();deco.fillStyle(0x152a30,.7).fillRect(2400,380,500,720);
  this.add.text(110,960,'USINA NECRONICA\nLIMPE O PATIO >',STYLE);this.add.text(2480,960,'TORRE\nSUBA ^',STYLE);
  this.platforms=this.physics.add.staticGroup();
  // Locate the broad upper deck, ignoring transparent padding and raised lamps.
  const platformFrames=new Map();
  const platformFrame=key=>{
   if(platformFrames.has(key))return platformFrames.get(key);
   const texture=this.textures.get(key),source=texture.getSourceImage(),canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;
   const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(source,0,0);const data=context.getImageData(0,0,canvas.width,canvas.height).data;
   let left=canvas.width,right=-1,first=canvas.height,last=-1;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x);first=Math.min(first,y);last=Math.max(last,y);}
   if(right<left){left=0;right=canvas.width-1;first=0;last=canvas.height-1;}
   const width=right-left+1,height=last-first+1;let surface=first;
   const start=left+Math.floor(width*.15),end=left+Math.ceil(width*.85);
   for(let y=first;y<=last;y++){let solid=0;for(let x=start;x<end;x++)if(data[(y*canvas.width+x)*4+3]>128)solid++;if(solid/(end-start)>=.9){surface=y;break;}}
   if(!texture.has('platform-art'))texture.add('platform-art',0,left,first,width,height);
   const frame={width,height,surfaceOffset:surface-first};platformFrames.set(key,frame);return frame;
  };
  // Artwork extends below the ledge; only the invisible top slab is solid.
  const platform=(x,y,w,art,ground=false)=>{
   const key='platform-'+art,frame=platformFrame(key),top=y-12,scale=(ground?128:w)/frame.width,offset=frame.surfaceOffset*scale;
   const visual=ground?this.add.tileSprite(x,top-offset,w,frame.height*scale,key,'platform-art').setOrigin(.5,0).setTileScale(scale):this.add.image(x,top-offset,key,'platform-art').setOrigin(.5,0).setDisplaySize(w,frame.height*scale);
   visual.setTint(0xffa34d).setDepth(2);
   const slab=this.add.rectangle(x,y,w,24,0x000000,0);this.physics.add.existing(slab,true);this.platforms.add(slab);slab.art=visual;slab.artType=art;slab.artSurfaceOffset=offset;return slab;
  };
  this.groundLayout=[[350,1100,700],[990,1100,360],[1480,1100,440],[1980,1100,320],[2620,1100,600]];
  this.groundLayout.forEach((p,i)=>platform(...p,i%2?'ground-slime':'ground-metal',true));platform(3500,500,1200,'ground-metal',true);
  [[530,1000,140,'girder'],[880,1000,140,'bracket'],[1160,990,140,'beam'],[1470,1000,130,'pillar'],[1820,1010,160,'girder'],[2240,1010,140,'bracket'],[2570,1010,150,'tower'],[2740,920,150,'bracket'],[2570,830,150,'beam'],[2740,740,150,'bracket'],[2570,650,150,'beam'],[2740,560,150,'bracket'],[2870,470,150,'beam'],[3530,415,130,'bracket']].forEach(p=>platform(...p));
  // Derive hazards from actual floor gaps so art and collision cannot drift apart.
  this.lavaPits=this.groundLayout.slice(0,-1).map((segment,i)=>{
   const left=segment[0]+segment[2]/2,next=this.groundLayout[i+1],right=next[0]-next[2]/2,top=segment[1]-12,height=1200-top;
   const visual=this.add.image(left,top,'lava-pit').setOrigin(0).setDisplaySize(right-left,height).setDepth(1);
   const rim=this.add.graphics().setDepth(3);rim.fillStyle(0xffa83d).fillRect(left-4,top-2,4,4).fillRect(right,top-2,4,4);
   const glow=this.add.rectangle((left+right)/2,top+height*.34,right-left-8,5,0xffbc42,.3).setDepth(1);
   this.tweens.add({targets:glow,alpha:.65,duration:650+i*80,yoyo:true,repeat:-1});
   return {left,right,top,surface:top+height*.33,visual};
  });
  this.player=this.physics.add.sprite(90,1020,'asset-player').setScale(.25).setDepth(8);this.player.body.setSize(88,136,true);this.player.setMaxVelocity(245,650);this.physics.add.collider(this.player,this.platforms);
  this.enemies=this.physics.add.group();this.shots=this.physics.add.group({allowGravity:false});this.hostile=this.physics.add.group({allowGravity:false});this.pickups=this.physics.add.group();this.crates=this.physics.add.staticGroup();
  this.physics.add.collider(this.enemies,this.platforms);this.physics.add.collider(this.pickups,this.platforms);
  this.physics.add.collider(this.shots,this.platforms,b=>b.destroy());this.physics.add.collider(this.hostile,this.platforms,b=>b.destroy(),b=>!b.bossProjectile);
  this.physics.add.overlap(this.shots,this.enemies,(b,e)=>this.hitEnemy(b,e));
  this.physics.add.overlap(this.player,this.enemies,(_,e)=>{if(e.activated&&e.damaging)this.hitPlayer();});
  this.physics.add.overlap(this.player,this.hostile,(_,b)=>{if(this.mode==='playing'){b.destroy();this.hitPlayer();}});
  this.physics.add.overlap(this.player,this.pickups,(_,p)=>{this.weapon=p.weapon;this.score+=50;sound.play('pickup');this.notice('ARMA: '+p.weapon.toUpperCase());p.destroy();});
  [["basic",390,1050],["runner",610,1050],["guard",530,950],["turret",900,1050],["basic",1040,1050],["guard",1160,940],["heavy",1390,1050],["shooter",1600,1050],["flyer",1720,920],["runner",1940,1050],["turret",1820,960],["basic",2050,1050],["ambush",2380,1050],["guard",2240,960],["shooter",2570,960],["heavy",2770,1050],["flyer",2820,820],["guard",2570,780],["turret",2740,690],["ambush",2570,600],["flyer",2810,550],["guard",2740,510],["runner",3080,450],["basic",3190,450],["shooter",3350,450],["heavy",3440,450]].forEach((e,i)=>this.spawnEnemy(...e,i));
  this.flags=[{x:1320,y:1060,name:'PATIO',active:false},{x:2480,y:1060,name:'TORRE',active:false},{x:3010,y:460,name:'NUCLEO',active:false}];for(const f of this.flags){f.visual=this.add.image(f.x,f.y+28,'checkpoint-neutral').setOrigin(.5,1).setScale(.25).setDepth(4);f.sway=this.tweens.add({targets:f.visual,angle:{from:-.8,to:.8},duration:1300,yoyo:true,repeat:-1});this.add.text(f.x-8,f.y+15,'CP',STYLE).setDepth(5);}
  this.boss=this.physics.add.sprite(3978,488,'boss-static-neutral').setOrigin(1,1).setDisplaySize(240,250).setImmovable(true).setDepth(6);this.boss.play('boss-idle');this.boss.body.setSize(614,874).setOffset(400,246);this.boss.body.allowGravity=false;this.boss.hp=100;this.boss.maxHP=100;
  this.bossMouth={x:3865,y:365};this.core=this.add.circle(this.bossMouth.x,this.bossMouth.y,9,0xcaff65,.35).setDepth(7);this.bossAttackUntil=0;
  this.physics.add.overlap(this.boss,this.shots,(boss,b)=>{if(!this.bossStarted||this.mode!=='playing')return;const weak=Math.abs(b.y-this.bossMouth.y)<22;boss.hp-=b.damage*(weak?2:1);b.destroy();boss.setTint(0xffd4ae);this.time.delayedCall(80,()=>{if(boss.active)boss.clearTint();});sound.play('hit');if(boss.hp<=0)this.win();});
  this.physics.add.overlap(this.player,this.boss,()=>this.hitPlayer());
  this.cameras.main.startFollow(this.player,true,.14,.14).setDeadzone(140,100);
    this.keys=this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,P,ESC,ENTER');this.input.keyboard.addCapture(['SPACE','UP','DOWN','LEFT','RIGHT']);
  this.input.keyboard.on('keydown-P',()=>this.pauseGame());this.input.keyboard.on('keydown-ESC',()=>this.pauseGame());this.input.keyboard.on('keydown-ENTER',()=>{if(document.activeElement?.tagName==='INPUT')return;if(this.mode==='title')this.start();else if(['won','lost'].includes(this.mode))this.scene.restart();});
  this.input.on('pointerdown',()=>{if(this.mode==='title')this.start();});
  this.hud=this.add.text(252,145,'',STYLE).setScrollFactor(0).setDepth(100);this.message=this.add.text(480,187,'',{...STYLE,fontSize:'10px',color:'#caff65'}).setOrigin(.5).setScrollFactor(0).setDepth(100);this.bossBar=this.add.graphics().setPosition(240,135).setScrollFactor(0).setDepth(100);
  this.overlay=this.add.container(240,135).setScrollFactor(0).setDepth(200);this.screen('BOB ROLL','CONTRA O LIXO','A usina infectou a cidade. Desative o nucleo zumbi.\nCorra, salte, recolha armas e suba a torre.\n\nENTER ou toque para comecar','APRESENTADO POR HIPERROLL');this.physics.pause();
  this.game.events.on('blur',this.onBlur,this);this.events.once('shutdown',()=>{this.game.events.off('blur',this.onBlur,this);for(const name of ['walk','idle','enemy-walk','boss-idle','flyer-hover',...Object.keys(ENEMY_ART).map(t=>'enemy-'+t)])this.anims.remove(name);});
 }
 screen(title,subtitle,body,footer){this.overlay.removeAll(true);this.overlay.add(this.add.rectangle(240,135,480,270,0x070e17,.95));this.overlay.add(this.add.text(240,38,title,{...STYLE,fontSize:'28px',color:'#caff65'}).setOrigin(.5));this.overlay.add(this.add.text(240,74,subtitle,{...STYLE,fontSize:'16px'}).setOrigin(.5));this.overlay.add(this.add.text(240,143,body,{...STYLE,fontSize:'10px',align:'center',lineSpacing:7}).setOrigin(.5));this.overlay.add(this.add.text(240,240,footer,{...STYLE,fontSize:'10px',color:'#8aac92'}).setOrigin(.5));if(['won','lost'].includes(this.mode)){const retry=this.add.text(240,209,'[ JOGAR NOVAMENTE ]',{...STYLE,color:'#caff65'}).setOrigin(.5).setInteractive({useHandCursor:true});retry.on('pointerdown',()=>this.scene.restart());this.overlay.add(retry);}}
 start(){if(this.mode!=='title')return;const pilot=document.querySelector('#pilot'),name=pilot.value.trim().slice(0,16);if(!name){document.querySelector('#pilot-error').hidden=false;pilot.setAttribute('aria-invalid','true');pilot.focus();return;}this.pilotName=name;document.querySelector('#pilot-error').hidden=true;pilot.removeAttribute('aria-invalid');document.querySelector('#pilot-entry').hidden=true;document.querySelector('#pilot').blur();sound.unlock();sound.play('transition');this.overlay.removeAll(true);this.mode='playing';this.physics.resume();}
 onBlur(){if(this.mode==='playing')this.pauseGame();}
 pauseGame(){resetTouch();if(this.mode==='playing'){this.mode='paused';this.pauseAt=this.time.now;this.physics.pause();this.screen('PAUSA','RESPIRE. RECARREGUE.','P ou ESC para continuar','HIPERROLL / CONTRA O LIXO');}else if(this.mode==='paused'){const dt=this.time.now-this.pauseAt;this.nextShot+=dt;this.invincible+=dt;if(this.bossNext)this.bossNext+=dt;this.bossAttackUntil+=dt;for(const e of this.enemies.getChildren()){e.nextAttack+=dt;e.poseUntil+=dt;}for(const g of [this.shots,this.hostile])for(const b of g.getChildren())b.expires+=dt;this.mode='playing';this.overlay.removeAll(true);this.physics.resume();}}
 notice(s){this.message.setText(s);this.time.delayedCall(2200,()=>{if(this.message.text===s)this.message.setText('');});}
 spawnEnemy(type,x,y,index){return EnemySystem.spawn(this,type,x,y,index);}
 drop(x,y,weapon){const p=this.pickups.create(x,y,'powerup-'+weapon).setDisplaySize(64,23).setDepth(4);p.weapon=weapon;p.body.setSize(p.width*.9,p.height*.9,true);p.setVelocityY(-140);return p;}
 burst(x,y,color){sound.play('explosion');for(let i=0;i<8;i++){const part=this.add.rectangle(x,y,4,4,color).setDepth(9),a=i*Math.PI/4;this.tweens.add({targets:part,x:x+Math.cos(a)*28,y:y+Math.sin(a)*28,alpha:0,duration:250,onComplete:()=>part.destroy()});}}
 hitEnemy(b,e){if(!e.active)return;if(!e.activated){e.activated=true;e.nextAttack=this.time.now+1100;if(e.type==='ambush')e.phase='emerging';}e.hp-=b.damage;b.destroy();if(e.hp<=0){this.score+=100;sound.play('enemy');this.burst(e.x,e.y,0xcaff65);if(e.type==='heavy'&&e.home<1500)this.drop(e.x,e.y,e.dropWeapon);e.destroy();}else sound.play('hit');}
 shoot(dx,dy){const w=WEAPONS[this.weapon],base=Math.atan2(dy,dx);for(const offset of(this.weapon==='Spread'?[-.25,-.125,0,.125,.25]:[0])){const a=base+offset,b=this.shots.create(this.player.x+Math.cos(a)*22,this.player.y-5+Math.sin(a)*22,'shot-'+this.weapon).setDisplaySize(this.weapon==='Laser'?72:32,this.weapon==='Laser'?13:this.weapon==='Rifle'?15:10).setRotation(a).setDepth(9);b.body.setSize((this.weapon==='Laser'?24:12)/b.scaleX,6/b.scaleY,true);b.setVelocity(Math.cos(a)*w.speed,Math.sin(a)*w.speed);b.damage=w.damage;b.expires=this.time.now+1350;}sound.play('shot');this.nextShot=this.time.now+w.rate;}
 enemyShot(x,y,a,speed=170,texture='asset-hostile'){const b=this.hostile.create(x,y,texture).setScale(.25).setDepth(10).setRotation(a);b.setVelocity(Math.cos(a)*speed,Math.sin(a)*speed);b.expires=this.time.now+3400;}
 bossShot(x,y,a,speed){this.enemyShot(x,y,a,speed,'boss-toxic-shot');const b=this.hostile.getChildren().at(-1);b.bossProjectile=true;b.expires=this.time.now+6000;b.setRotation(a-Math.PI);b.body.setSize(b.width*.5,b.height*.5,true);}
 hitPlayer(){if(this.mode!=='playing'||this.time.now<this.invincible)return;this.health--;sound.play('hit');this.cameras.main.shake(70,.003);if(this.health<=0){this.die();return;}this.invincible=this.time.now+1000;this.notice('SAUDE: '+this.health+'/3');}
 die(fall=false){if(this.mode!=='playing'||(!fall&&this.time.now<this.invincible))return;this.lives--;this.health=3;sound.play('death');this.burst(this.player.x,this.player.y,0xff8a70);this.hostile.clear(true,true);this.shots.clear(true,true);if(this.lives<=0){this.mode='lost';this.health=0;resetTouch();ranking.finish(this);this.physics.pause();this.screen('FIM DE JOGO','A CIDADE PRECISA DE VOCE',`PONTOS ${this.score}\nENTER para uma nova missao`,'BOB ROLL / PATROCINIO HIPERROLL');return;}this.player.body.reset(this.checkpoint.x,this.checkpoint.y);this.player.setVelocity(0,0);this.invincible=this.time.now+2200;this.weapon='Rifle';this.notice('CHECKPOINT: '+this.checkpoint.name);if(this.bossStarted){this.boss.hp=this.boss.maxHP;this.bossBeat=0;this.bossAttackUntil=0;this.bossNext=this.time.now+1800;}}
 win(){Ending.play(this);}

 update(time,delta=0){
  this.hud.setText(`BOB HP ${this.health}/3  VIDAS ${this.lives}  ${this.weapon.toUpperCase()}\n${String(this.score).padStart(6,'0')}  CP ${this.checkpoint.name}`);document.querySelector('#run-stats').textContent='SAUDE '+ '♥ '.repeat(this.health)+' · VIDAS '+this.lives+' · TEMPO '+formatTime(Math.floor(this.elapsed/1000))+' · PONTOS '+String(this.score).padStart(6,'0');document.querySelector('#pause').textContent=this.mode==='paused'?'CONTINUAR':'PAUSAR';if(this.mode!=='playing')return;this.elapsed+=delta;
    const k=this.keys,left=k.LEFT.isDown||k.A.isDown||touch.left,right=k.RIGHT.isDown||k.D.isDown||touch.right,up=k.UP.isDown||k.W.isDown||touch.up,down=k.DOWN.isDown||k.S.isDown||touch.down,jump=k.UP.isDown||k.W.isDown||touch.jump,h=Number(right)-Number(left);
    if(h)this.facing=h;this.player.setVelocityX(h*205).setFlipX(this.facing<0);
    const crouching=down&&this.player.body.blocked.down;if(crouching!==this.crouching){this.crouching=crouching;const height=crouching?80:136;this.player.body.setSize(88,height,false).setOffset((this.player.width-88)/2,(this.player.height-136)/2+136-height);}
  if(this.player.body.blocked.down)this.lastGround=time;if(jump&&!this.lastJump)this.jumpBuffer=time+110;
  if(this.jumpBuffer>time&&time-this.lastGround<95){this.player.setVelocityY(-465);this.jumpBuffer=0;this.lastGround=-1000;sound.play('jump');}
  if(!jump&&this.lastJump&&this.player.body.velocity.y<-170)this.player.setVelocityY(-170);this.lastJump=jump;
    if((k.SPACE.isDown||touch.shoot)&&time>=this.nextShot)this.shoot(h||(up===down?this.facing:0),Number(down)-Number(up));
  this.player.setAlpha(time<this.invincible?(Math.floor(time/90)%2?.3:1):1);
    if(crouching){this.player.anims.stop();this.player.setTexture('asset-player-crouch');}else if(!this.player.body.blocked.down){this.player.anims.stop();this.player.setTexture('asset-player-jump');}else this.player.play(h?'walk':'idle',true);
  if(this.player.y>1165||this.player.x<0||this.lavaPits.some(p=>this.player.body.right>p.left&&this.player.body.left<p.right&&this.player.body.bottom>=p.surface))this.die(true);
  for(const f of this.flags)if(!f.active&&Math.abs(this.player.x-f.x)<50&&Math.abs(this.player.y-f.y)<55){f.active=true;f.visual.setTexture('checkpoint-flag').clearTint();this.tweens.add({targets:f.visual,alpha:{from:.3,to:1},duration:350});this.burst(f.x,f.y-30,0x8ae6ff);this.checkpoint={x:f.x,y:f.y-20,name:f.name};this.notice('CHECKPOINT ATIVADO: '+f.name);sound.play('pickup');}
  for(const p of [...this.pickups.getChildren()])if(p.y>1170)p.destroy();
  for(const group of[this.shots,this.hostile])for(const b of[...group.getChildren()])if(time>b.expires)b.destroy();
  EnemySystem.update(this,time);
  if(this.player.x>3500&&!this.bossStarted){this.bossStarted=true;this.cameras.main.stopFollow();this.cameras.main.centerOn(3740,370);this.checkpoint={x:3540,y:450,name:'ARENA'};this.bossNext=time+1900;sound.play('boss');this.notice('NECROCOMPACTADOR / NUCLEO VERDE');}
  if(this.bossStarted&&this.boss.active){
   if(this.player.x<3512){this.player.x=3512;this.player.body.updateFromGameObject();}
   const rage=this.boss.hp<50;this.bossBar.clear().fillStyle(0x182125).fillRect(270,12,197,10).fillStyle(rage?0xff7966:0xcaff65).fillRect(272,14,193*Math.max(0,this.boss.hp/100),6);
   const windup=this.bossNext-time;
   if(time<this.bossAttackUntil){this.boss.anims.stop();this.boss.setTexture('boss-static-attack');}else if(windup<700){this.boss.anims.stop();this.boss.setTexture(windup<300?'boss-static-attack':'boss-static-mouth');}else this.boss.play('boss-idle',true);
   this.core.setAlpha(windup<700?.65:.2);
   if(time>this.bossNext){this.bossBeat++;this.bossAttackUntil=time+320;const {x,y}=this.bossMouth,a=Math.atan2(this.player.y-y,this.player.x-x),speed=rage?200:155;
    if(this.bossBeat%3===0){for(let i=-2;i<=2;i++)this.bossShot(x,y,Math.PI+i*.24,speed);}
    else if(this.bossBeat%3===1){for(let i=-1;i<=1;i++)this.bossShot(x,y,a+i*.2,speed);}
    else{for(let i=0;i<3;i++)this.bossShot(x,y,Math.PI-.12+i*.22,speed*.9);}
    this.bossNext=time+(rage?1650:2250);sound.play('boss');
   }
  }
 }
}
if(window.Phaser)window.bobGame=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,pixelArt:false,roundPixels:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{gravity:{y:900},debug:false}},scene:[Mission]});








