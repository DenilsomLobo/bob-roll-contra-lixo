import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {projectPath} from './paths.mjs';
import net from 'node:net';
import {randomBytes} from 'node:crypto';
export async function openBrowser(){
 const keepAlive=setInterval(()=>{},1000);
 const profile=projectPath('.tmp/chrome-art');await mkdir(profile,{recursive:true});
 const child=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--no-sandbox','--disable-gpu','--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=9337',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
 let tabs;for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9337/json')).json();if(tabs.length)break;}catch{}await new Promise(r=>setTimeout(r,150));}
 if(!tabs?.length)throw Error('Chrome não iniciou');
 const url=new URL(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),socket=net.connect(Number(url.port),url.hostname);
 let buffer=Buffer.alloc(0),ready=false,id=0;const pending=new Map();
 await new Promise((resolve,reject)=>{socket.on('error',reject);socket.on('connect',()=>socket.write(`GET ${url.pathname} HTTP/1.1\r\nHost: ${url.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${randomBytes(16).toString('base64')}\r\nSec-WebSocket-Version: 13\r\n\r\n`));socket.on('data',data=>{buffer=Buffer.concat([buffer,data]);if(!ready){const end=buffer.indexOf('\r\n\r\n');if(end<0)return;buffer=buffer.subarray(end+4);ready=true;resolve();}while(buffer.length>=2){let size=buffer[1]&127,header=2;if(size===126){if(buffer.length<4)return;size=buffer.readUInt16BE(2);header=4;}else if(size===127){if(buffer.length<10)return;size=Number(buffer.readBigUInt64BE(2));header=10;}if(buffer.length<header+size)return;const opcode=buffer[0]&15,payload=buffer.subarray(header,header+size);buffer=buffer.subarray(header+size);if(opcode!==1)continue;const m=JSON.parse(payload.toString());if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}}}});});
 const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});const data=Buffer.from(JSON.stringify({id,method,params})),mask=randomBytes(4),header=Buffer.alloc(data.length<126?2:data.length<65536?4:10);header[0]=0x81;if(header.length===2)header[1]=0x80|data.length;else if(header.length===4){header[1]=0xfe;header.writeUInt16BE(data.length,2);}else{header[1]=0xff;header.writeBigUInt64BE(BigInt(data.length),2);}for(let i=0;i<data.length;i++)data[i]^=mask[i%4];socket.write(Buffer.concat([header,mask,data]));setTimeout(()=>reject(Error('CDP timeout: '+method)),15000).unref();});
 await send('Runtime.enable');await send('Page.enable');
 return {send,async evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;},async close(){await send('Browser.close');socket.destroy();child.kill();clearInterval(keepAlive);}};
}
