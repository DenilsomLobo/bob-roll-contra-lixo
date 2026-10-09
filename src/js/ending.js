const Ending={
 preload(scene){for(const key of ['victory-banner','victory-explosion','bob-victory',...Array.from({length:6},(_,i)=>'bob-dance-'+(i+1)),...Array.from({length:5},(_,i)=>'robot-dance-'+(i+1))])scene.load.image(key,'assets/game-art/'+key+'.png');},
 create(scene){for(const [key,prefix,count]of [['victory-dance','bob-dance-',6],['robot-dance','robot-dance-',5]])if(!scene.anims.exists(key))scene.anims.create({key,frames:Array.from({length:count},(_,i)=>({key:prefix+(i+1)})),frameRate:8,repeat:-1});},
 play(scene){
  if(scene.mode!=='playing')return;
  scene.mode='celebrating';scene.score+=2000;resetTouch();scene.physics.pause();scene.hostile.clear(true,true);scene.shots.clear(true,true);scene.enemies.getChildren().forEach(e=>e.anims.stop());scene.player.anims.stop();scene.player.setVisible(false);scene.boss.anims.stop();scene.core.destroy();scene.bossBar.clear();scene.message.setText('');
  const view=scene.cameras.main.worldView,floor=488;
  const explosion=scene.add.image(scene.boss.x-110,floor-110,'victory-explosion').setDepth(20).setScale(.08);
  scene.tweens.add({targets:explosion,scaleX:.33,scaleY:.33,duration:450,ease:'Cubic.Out',onComplete:()=>scene.tweens.add({targets:explosion,alpha:0,scaleX:.4,scaleY:.4,duration:400,onComplete:()=>explosion.destroy()})});
  scene.tweens.add({targets:scene.boss,alpha:0,duration:550,onComplete:()=>scene.boss.destroy()});scene.cameras.main.flash(180,180,255,90);scene.cameras.main.shake(350,.006);sound.play('explosion');
  const bob=scene.add.sprite(view.centerX-35,floor,'bob-victory').setOrigin(.5,1).setScale(.25).setDepth(21);scene.victoryBob=bob;
  const banner=scene.add.image(view.centerX,view.top+95,'victory-banner').setDepth(22).setScale(.16).setAlpha(0).setVisible(false);scene.victoryBanner=banner;
  scene.tweens.add({targets:bob,y:floor-65,duration:220,ease:'Sine.Out',onComplete:()=>scene.time.delayedCall(300,()=>scene.tweens.add({targets:bob,y:floor,duration:280,ease:'Quad.In',onComplete:()=>{bob.play('victory-dance');banner.setVisible(true);scene.tweens.add({targets:banner,alpha:1,scaleX:.25,scaleY:.25,duration:400,ease:'Back.Out'});}}))});
  const robot=scene.add.sprite(view.centerX+55,view.top-80,'robot-dance-1').setOrigin(.5,1).setScale(.25).setDepth(21);scene.victoryRobot=robot;robot.play('robot-dance');
  scene.tweens.add({targets:robot,y:floor,duration:650,delay:800,ease:'Bounce.Out'});
  scene.time.delayedCall(4000,()=>{banner.destroy();bob.destroy();robot.destroy();scene.mode='won';ranking.finish(scene);sound.play('transition');scene.screen('MISSAO CUMPRIDA','A CIDADE VOLTOU A RESPIRAR',`Nucleo neutralizado / ${scene.score} pontos\nBOB ROLL E BOB-ROBO\nCreditos: Denilsom Lobo\nObrigado por jogar!`,'PATROCINIO HIPERROLL');scene.overlay.y+=30;scene.tweens.add({targets:scene.overlay,y:135,duration:650,ease:'Sine.Out'});});
 }
};
