// Rebuild derived art at 4x resolution without changing reference PNGs.
import {readFile as readDiskFile,writeFile as writeDiskFile,access as accessDisk} from 'node:fs/promises';
import {projectPath} from '../lib/paths.mjs';
const readFile=(file,...args)=>readDiskFile(projectPath(file),...args);
const writeFile=(file,...args)=>writeDiskFile(projectPath(file),...args);
const access=file=>accessDisk(projectPath(file));
import {createHash} from 'node:crypto';
import {openBrowser} from '../lib/browser-runtime.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const previousManifest=JSON.parse(await readFile('assets/game-art/sources.json','utf8'));
const browser=await openBrowser();
const jobs=[];const add=(source,box,size,name,reference=[1536,1024])=>jobs.push({source,box,size:size.map(n=>n*4),name,reference});
add('movimentacao_personagem.png',[5,46,216,239],[40,40],'bob-idle');
[[656,47,838,240],[835,47,976,240],[976,47,1120,240],[1118,47,1260,240],[1258,47,1400,240],[1390,47,1536,240]].forEach((b,i)=>add('movimentacao_personagem.png',b,[40,40],`bob-run-${i+1}`));
add('movimentacao_personagem.png',[172,275,357,483],[40,40],'bob-jump');add('movimentacao_personagem.png',[824,350,1009,521],[40,40],'bob-crouch');
[[12,52,212,233],[216,52,414,233],[418,52,620,233],[630,52,835,233]].forEach((b,i)=>add('inimigo_1.png',b,[32,32],`enemy-walk-${i+1}`));
add('inimigo_1.png',[19,831,239,962],[18,10],'slime-shot');
[[6,42,245,202],[246,42,497,202],[500,42,766,202]].forEach((b,i)=>add('boss_1.png',b,[160,120],`boss-idle-${i+1}`));
add('boss.png',[293,542,576,765],[160,120],'boss-attack');add('projetil.png',[45,230,1480,863],[32,15],'bob-shot');add('plataforma_cenario.png',[202,35,359,142],[96,24],'platform');
// Individual scenery pieces, with their walkable edge at the top of each crop.
add('plataforma_cenario.png',[201,41,359,167],[96,56],'platform-ground-metal');
add('plataforma_cenario.png',[15,49,198,154],[96,56],'platform-ground-slime');
add('plataforma_cenario.png',[16,633,335,663],[128,12],'platform-beam');
add('plataforma_cenario.png',[285,208,465,411],[120,130],'platform-girder');
add('plataforma_cenario.png',[482,205,560,411],[72,130],'platform-pillar');
add('plataforma_cenario.png',[1051,198,1209,318],[140,100],'platform-bracket');
add('plataforma_cenario.png',[1393,199,1510,306],[120,90],'platform-tower');
[[3,7,231,243],[235,8,463,243],[465,8,692,243],[693,7,925,243]].forEach((b,i)=>add('inimigo_aerio.png',b,[40,40],`flyer-hover-${i+1}`));add('inimigo_aerio.png',[14,246,221,438],[40,40],'flyer-attack');
add('Caixa de Power-Up Espalhamento Retro.png',[130,65,1415,508],[64,23],'powerup-spread');
add('Caixa de Power-Up Espalhamento Retro.png',[585,670,910,791],[26,10],'shot-spread');
add('Caixa Rapid e Projétil Incandescente.png',[114,108,1415,564],[64,23],'powerup-rapid');
add('Caixa Rapid e Projétil Incandescente.png',[155,637,1300,880],[32,9],'shot-rapid');
add('Caixa de Rifle e Disparo Energético.png',[132,135,1400,565],[64,23],'powerup-rifle');
add('projetil.png',[45,230,1480,863],[32,15],'shot-rifle');
add('Módulo LASER e Feixe Energético.png',[65,5,1405,413],[64,23],'powerup-laser',[2172,724]);
add('Módulo LASER e Feixe Energético.png',[8,419,2165,715],[72,13],'shot-laser',[2172,724]);
const enemyJobs=JSON.parse(await readFile('scripts/art/enemy-art-jobs.json','utf8'));
for(const j of enemyJobs)add(j.source,j.box,j.size,j.name,j.reference);
const setpieceJobs=JSON.parse(await readFile('scripts/art/setpiece-art-jobs.json','utf8'));
for(const j of setpieceJobs)add(j.source,j.box,j.size,j.name,j.reference);
if(process.argv.includes('--enemies-only'))jobs.splice(0,jobs.length,...jobs.filter(j=>enemyJobs.some(e=>e.name===j.name)));
if((process.argv.includes('--setpieces-only')||process.argv.includes('--victory-only')))jobs.splice(0,jobs.length,...jobs.filter(j=>setpieceJobs.some(e=>e.name===j.name)));
const victoryJobs=JSON.parse(await readFile('scripts/art/victory-art-jobs.json','utf8'));
if(process.argv.includes('--victory-only'))jobs.splice(0,jobs.length);if(process.argv.includes('--victory-only')||!process.argv.some(a=>['--enemies-only','--setpieces-only'].includes(a)))for(const j of victoryJobs)add(j.source,j.box,j.size,j.name,j.reference);
const hashes={};
try{for(const job of jobs){const bytes=await readFile('assets/'+job.source);hashes[job.source]=hash(bytes);
 // Preserve platform PNGs replaced by the artist. Explicitly opt in to old reference crops.
 if(job.name.startsWith('platform')&&!process.argv.includes('--rebuild-reference-platforms')){try{await access('assets/game-art/'+job.name+'.png');continue;}catch{}}
 const data=await browser.evaluate(`(async()=>{
 const job=${JSON.stringify(job)},img=new Image();img.src='data:image/png;base64,${bytes.toString('base64')}';await img.decode();
 const [x,y,x2,y2]=job.box,w=x2-x,h=y2-y,c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.drawImage(img,x*img.width/job.reference[0],y*img.height/job.reference[1],w*img.width/job.reference[0],h*img.height/job.reference[1],0,0,w,h);
 const pixels=ctx.getImageData(0,0,w,h),a=pixels.data,seen=new Uint8Array(w*h),queue=[];
 // Existing alpha is authoritative, including enclosed transparent holes.
 for(let i=0;i<w*h;i++)if(a[i*4+3]===0)seen[i]=1;
 const isPlatform=job.name.startsWith('platform');
 const neutral=i=>Math.max(a[i*4],a[i*4+1],a[i*4+2])-Math.min(a[i*4],a[i*4+1],a[i*4+2])<32&&Math.min(a[i*4],a[i*4+1],a[i*4+2])>(isPlatform?180:98);
 const push=i=>{if(!seen[i]&&neutral(i)){seen[i]=1;queue.push(i);}};
 for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
 // Scaffold openings contain enclosed painted checkerboards too.
 if(isPlatform)for(let i=0;i<w*h;i++)push(i);
 for(let n=0;n<queue.length;n++){const i=queue[n],x=i%w,y=Math.floor(i/w);if(x)push(i-1);if(x<w-1)push(i+1);if(y)push(i-w);if(y<h-1)push(i+w);}
 const components=[],visited=new Uint8Array(w*h);for(let i=0;i<w*h;i++){if(seen[i]||visited[i])continue;const q=[i];visited[i]=1;for(let n=0;n<q.length;n++){const k=q[n],x=k%w,y=Math.floor(k/w);for(const j of [x?k-1:-1,x<w-1?k+1:-1,y?k-w:-1,y<h-1?k+w:-1])if(j>=0&&!seen[j]&&!visited[j]){visited[j]=1;q.push(j);}}components.push(q);}
 const largest=Math.max(...components.map(q=>q.length)),keep=new Uint8Array(w*h);for(const q of components)if(q.length>Math.max(30,largest*(job.name.includes('dance-')?.5:.025)))for(const i of q)keep[i]=1;
 let minX=w,minY=h,maxX=0,maxY=0;for(let i=0;i<w*h;i++){if(!keep[i])a[i*4+3]=0;if(keep[i]){minX=Math.min(minX,i%w);maxX=Math.max(maxX,i%w);minY=Math.min(minY,Math.floor(i/w));maxY=Math.max(maxY,Math.floor(i/w));}}
 ctx.putImageData(pixels,0,0);const out=document.createElement('canvas');[out.width,out.height]=job.size;const cw=maxX-minX+1,ch=maxY-minY+1,scale=Math.min((out.width-8)/cw,(out.height-8)/ch),dw=cw*scale,dh=ch*scale;const oc=out.getContext('2d');if(job.name.startsWith('platform'))oc.drawImage(c,minX,minY,cw,ch,0,0,out.width,out.height);else oc.drawImage(c,minX,minY,cw,ch,job.name.startsWith('boss-static-')?out.width-dw-4:(out.width-dw)/2,out.height-dh-4,dw,dh);return out.toDataURL('image/png').split(',')[1];})()`);
 await writeFile(`assets/game-art/${job.name}.png`,Buffer.from(data,'base64'));
 }
 // Keep the full original background resolution and colors.
 const bg=await readFile('assets/cenario_1.png');hashes['cenario_1.png']=hash(bg);await writeFile('assets/game-art/factory-background.png',bg);
 for(const [file,h]of Object.entries(hashes))if(hash(await readFile('assets/'+file))!==h)throw Error('Original alterado: '+file);
 await writeFile('assets/game-art/sources.json',JSON.stringify({method:'High-resolution derived reference art; 4x sprite textures; original background; checkerboard removal including scaffold openings',original_sha256:{...previousManifest.original_sha256,...hashes},enemy_crops:enemyJobs,setpiece_crops:setpieceJobs,victory_crops:victoryJobs,platform_crops:(process.argv.includes('--enemies-only')||(process.argv.includes('--setpieces-only')||process.argv.includes('--victory-only')))?previousManifest.platform_crops:jobs.filter(j=>j.source==='plataforma_cenario.png').map(({name,box,size})=>({file:name+'.png',box,size})),weapon_crops:(process.argv.includes('--enemies-only')||process.argv.includes('--setpieces-only')||process.argv.includes('--victory-only'))?previousManifest.weapon_crops:jobs.filter(j=>j.name.startsWith('powerup-')||j.name.startsWith('shot-')).map(({name,source,box,size,reference})=>({file:name+'.png',source,box,size,reference})),generated_assets:{'lava-pit.png':'ImageGen industrial lava shaft; references cenario_1.png and plataforma_cenario.png. Kept independently; not regenerated by this script.'}},null,2));console.log('Arte reconstruída; originais preservados.');
}finally{await browser.close();}
