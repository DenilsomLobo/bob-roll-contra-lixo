import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {PROJECT_ROOT} from '../scripts/lib/paths.mjs';
const root=path.resolve(PROJECT_ROOT);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const allowed=pathname==='/index.html'||['/src/','/vendor/','/assets/'].some(prefix=>pathname.startsWith(prefix));
  const file=path.resolve(root,'.'+pathname);
  if(!allowed||!file.startsWith(root+path.sep)){res.writeHead(404);res.end('Not found');return;}
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Bob Roll: http://localhost:'+server.address().port));

