import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const PROJECT_ROOT=fileURLToPath(new URL('../../',import.meta.url));
export const projectPath=(...parts)=>path.join(PROJECT_ROOT,...parts);
export const artifactPath=name=>projectPath('artifacts',path.extname(name)==='.json'?'reports':'previews',path.basename(name));
