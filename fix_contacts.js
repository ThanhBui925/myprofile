const fs = require('fs');

let file = 'frontend/src/app/admin/(panel)/contacts/page.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update imports
content = content.replace(/import \{ Trash2, X, Eye, CheckCircle, Mail, Phone, Building2, MessageSquare \} from 'lucide-react';/, "import { Trash2, X, Eye, CheckCircle, Mail, Phone, Building2, MessageSquare, List, MailOpen, User, Calendar, Activity } from 'lucide-react';");

// Update filter buttons
content = content.replace(
  /<button onClick=\{\(\) => setFilterStatus\(''\)\} className=\{tn \$\{!filterStatus \? 'btn-primary' : 'btn-ghost'\}\}>T?t c?<\/button>/,
  '<button onClick={() => setFilterStatus(\'\')} className={tn  hide-text-mobile} style={{ display: \'flex\', gap: \'0.4rem\', alignItems: \'center\' }}><List size={16}/> <span>T?t c?</span></button>'
);
content = content.replace(
  /<button onClick=\{\(\) => setFilterStatus\('new'\)\} className=\{tn \$\{filterStatus === 'new' \? 'btn-primary' : 'btn-ghost'\}\}>M?i<\/button>/,
  '<button onClick={() => setFilterStatus(\'new\')} className={tn  hide-text-mobile} style={{ display: \'flex\', gap: \'0.4rem\', alignItems: \'center\' }}><Mail size={16}/> <span>M?i</span></button>'
);
content = content.replace(
  /<button onClick=\{\(\) => setFilterStatus\('read'\)\} className=\{tn \$\{filterStatus === 'read' \? 'btn-primary' : 'btn-ghost'\}\}>Ðã d?c<\/button>/,
  '<button onClick={() => setFilterStatus(\'read\')} className={tn  hide-text-mobile} style={{ display: \'flex\', gap: \'0.4rem\', alignItems: \'center\' }}><MailOpen size={16}/> <span>Ðã d?c</span></button>'
);

// Update table headers
content = content.replace(/<th>Ngu?i g?i<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><User size={15}/> <span>Ngu?i g?i</span></div></th>');
content = content.replace(/<th>Email<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Mail size={15}/> <span>Email</span></div></th>');
content = content.replace(/<th>S? di?n tho?i<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Phone size={15}/> <span>S? di?n tho?i</span></div></th>');
content = content.replace(/<th>D?ch v?<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><MessageSquare size={15}/> <span>D?ch v?</span></div></th>');
content = content.replace(/<th>Ngày g?i<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Calendar size={15}/> <span>Ngày g?i</span></div></th>');
content = content.replace(/<th>Tr?ng thái<\/th>/, '<th className="hide-text-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Activity size={15}/> <span>Tr?ng thái</span></div></th>');

fs.writeFileSync(file, content);
console.log('Fixed contacts page');
