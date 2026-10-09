import {spawn} from 'node:child_process';
import {projectPath,PROJECT_ROOT} from './lib/paths.mjs';
const server=spawn(process.execPath,[projectPath('server/server.mjs')],{cwd:PROJECT_ROOT,env:{...process.env,PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
try{
 const url=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Servidor não iniciou')),10000);server.on('error',reject);server.on('exit',code=>reject(Error('Servidor encerrou: '+code)));server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/localhost:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});});
 for(const file of ['joystick-art-test.mjs','terrain-test.mjs','powerup-test.mjs','enemy-health-test.mjs','boss-checkpoint-test.mjs']){
  console.log('\nTeste: '+file);
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[projectPath('tests',file)],{cwd:PROJECT_ROOT,env:{...process.env,BOB_GAME_URL:url},stdio:'inherit',windowsHide:true});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(file+' falhou: '+code)));});
 }
 console.log('\nTodos os testes passaram. Resultados em artifacts/.');
}finally{server.kill();}
