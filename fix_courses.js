const fs = require('fs');
let file = 'frontend/src/app/admin/(panel)/courses/page.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ Trash2, X, Upload, Plus, MinusCircle \} from 'lucide-react';/, "import { Trash2, X, Upload, Plus, MinusCircle, Image as ImageIcon, FileText, Tag, Activity, ToggleLeft, ToggleRight } from 'lucide-react';");

content = content.replace(/<th>Hình<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><ImageIcon size={15}/> <span>Hình</span></div></th>');
content = content.replace(/<th>Tên tài li?u<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><FileText size={15}/> <span>Tên tài li?u</span></div></th>');
content = content.replace(/<th>Danh m?c<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Tag size={15}/> <span>Danh m?c</span></div></th>');
content = content.replace(/<th>Tr?ng thái<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Activity size={15}/> <span>Tr?ng thái</span></div></th>');

fs.writeFileSync(file, content);
console.log('Fixed courses page');
