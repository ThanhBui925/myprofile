const fs = require('fs');
let file = 'frontend/src/app/admin/(panel)/users/page.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ Users, ToggleLeft, ToggleRight, Building2, Phone, Mail, FileText, X \} from 'lucide-react';/, "import { Users, ToggleLeft, ToggleRight, Building2, Phone, Mail, FileText, X, Calendar, Activity, User } from 'lucide-react';");

content = content.replace(/<th>Ngu?i dùng<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><User size={15}/> <span>Ngu?i dùng</span></div></th>');
content = content.replace(/<th>Ngày dang ký<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Calendar size={15}/> <span>Ngày dang ký</span></div></th>');
content = content.replace(/<th>Tr?ng thái<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Activity size={15}/> <span>Tr?ng thái</span></div></th>');

fs.writeFileSync(file, content);
console.log('Fixed users page');
