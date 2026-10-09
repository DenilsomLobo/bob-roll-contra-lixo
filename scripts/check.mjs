import {readdir,readFile,access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {projectPath} from './lib/paths.mjs';
async function files(dir){const out=[];for(const item of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())out.push(...await files(file));else if(/\.(js|mjs)$/.test(item.name))out.push(file);}return out;}
const sources=(await Promise.all(['src/js','server','scripts','tests'].map(dir=>files(projectPath(dir))))).flat();
for(const file of sources)await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['--check',file],{stdio:'inherit',windowsHide:true});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error('Syntax: '+file)));});
const html=await readFile(projectPath('index.html'),'utf8');
for(const [,url]of html.matchAll(/(?:src|href)="([^"]+)"/g))if(!/^(?:https?:|#)/.test(url))await access(projectPath(url));
console.log(`Sintaxe de ${sources.length} arquivos e caminhos do HTML verificados.`);
