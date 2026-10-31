const fs = require('fs');
let file = 'frontend/src/app/admin/(panel)/courses/page.jsx';
let content = fs.readFileSync(file, 'utf8');

// The headers
content = content.replace(/<th className="hide-text-mobile"><div style=\{\{display:"flex", alignItems:"center", gap:"0.4rem"\}\}><Tag size=\{15\}\/> <span>Danh m?c<\/span><\/div><\/th>/, '<th className="hide-on-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Tag size={15}/> <span>Danh m?c</span></div></th>');
content = content.replace(/<th className="hide-text-mobile"><div style=\{\{display:"flex", alignItems:"center", gap:"0.4rem"\}\}><Activity size=\{15\}\/> <span>Tr?ng thái<\/span><\/div><\/th>/, '<th className="hide-on-mobile"><div style={{display:"flex", alignItems:"center", gap:"0.4rem"}}><Activity size={15}/> <span>Tr?ng thái</span></div></th>');

// The other headers that don't have icons yet, but let's just replace them directly
content = content.replace(/<th>Catalog<\/th>/, '<th className="hide-on-mobile">Catalog</th>');
content = content.replace(/<th>Th? t?<\/th>/, '<th className="hide-on-mobile">Th? t?</th>');
content = content.replace(/<th>C?p nh?t<\/th>/, '<th className="hide-on-mobile">C?p nh?t</th>');
content = content.replace(/<th>Lu?t xem<\/th>/, '<th className="hide-on-mobile">Lu?t xem</th>');

// The data cells
content = content.replace(/<td style=\{\{ color: 'var\(--color-text-muted\)', fontSize: '0.85rem' \}\}>\{p.categoryVi \|\| '—'\}<\/td>/, '<td className="hide-on-mobile" style={{ color: \'var(--color-text-muted)\', fontSize: \'0.85rem\' }}>{p.categoryVi || \'—\'}</td>');
content = content.replace(/<td style=\{\{ color: 'var\(--color-text-muted\)', fontSize: '0.8rem' \}\}>\{p.specifications\?\.length \|\| 0\} thông tin<\/td>/, '<td className="hide-on-mobile" style={{ color: \'var(--color-text-muted)\', fontSize: \'0.8rem\' }}>{p.specifications?.length || 0} thông tin</td>');
content = content.replace(/<td>\{p.catalogUrl \? <span style=\{\{ color: 'var\(--color-success\)', fontSize: '0.8rem' \}\}>? Có<\/span> : <span style=\{\{ color: 'var\(--color-text-muted\)', fontSize: '0.8rem' \}\}>—<\/span>\}<\/td>/, '<td className="hide-on-mobile">{p.catalogUrl ? <span style={{ color: \'var(--color-success)\', fontSize: \'0.8rem\' }}>? Có</span> : <span style={{ color: \'var(--color-text-muted)\', fontSize: \'0.8rem\' }}>—</span>}</td>');
content = content.replace(/<td style=\{\{ color: 'var\(--color-text-muted\)' \}\}>\{p.order\}<\/td>/, '<td className="hide-on-mobile" style={{ color: \'var(--color-text-muted)\' }}>{p.order}</td>');

fs.writeFileSync(file, content);
console.log('Fixed courses page cells');
