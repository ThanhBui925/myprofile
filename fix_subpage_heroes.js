const fs = require('fs');

// Helper to replace matching multi-line blocks irrespective of CRLF/LF
function replaceBlock(filePath, startMarker, endMarker, newContent) {
  if (!fs.existsSync(filePath)) return false;
  let c = fs.readFileSync(filePath, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  const startIdx = normalized.indexOf(startMarker);
  if (startIdx === -1) return false;
  const endIdx = normalized.indexOf(endMarker, startIdx);
  if (endIdx === -1) return false;
  const actualEndIdx = endIdx + endMarker.length;
  normalized = normalized.substring(0, startIdx) + newContent + normalized.substring(actualEndIdx);
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(filePath, normalized, 'utf8');
  return true;
}

// Helper to add import statement at the top of file (after 'use client';)
function addImport(filePath, importStatement) {
  if (!fs.existsSync(filePath)) return false;
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes(importStatement)) return true;
  
  if (c.includes("'use client';") || c.includes('"use client";')) {
    c = c.replace(/'use client';/g, `'use client';\n${importStatement}`);
    c = c.replace(/"use client";/g, `"use client";\n${importStatement}`);
  } else {
    c = `${importStatement}\n${c}`;
  }
  fs.writeFileSync(filePath, c, 'utf8');
  return true;
}

// 1. Fix About Page
const aboutFile = 'frontend/src/app/(public)/about/page.jsx';
addImport(aboutFile, "import SubPageHero3D from '../../../components/common/SubPageHero3D';");
const aboutStart = '<div style={{ background: \'linear-gradient(135deg, #0A0A0A 0%, #1A0800 100%)\', padding: \'calc(var(--nav-height) + 2.5rem) 0 4rem\', textAlign: \'center\', position: \'relative\', overflow: \'hidden\' }}>';
const aboutEnd = '</div>\n      </div>';
const aboutNew = `<SubPageHero3D>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
          {lang === 'vi' ? \`Về \${appName}\` : \`About \${appName}\`}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', whiteSpace: 'pre-line' }}>
          {lang === 'vi' ? company?.aboutVi : company?.aboutEn}
        </p>
      </SubPageHero3D>`;

if (replaceBlock(aboutFile, aboutStart, aboutEnd, aboutNew)) {
  console.log('Fixed About Page Hero!');
} else {
  console.log('Failed to fix About Page Hero');
}

// 2. Fix Projects Page
const projectsFile = 'frontend/src/app/(public)/projects/page.jsx';
addImport(projectsFile, "import SubPageHero3D from '../../../components/common/SubPageHero3D';");
const projStart = '<div style={{ background: \'linear-gradient(135deg, #0A0A0A, #1A0800)\', padding: \'calc(var(--nav-height) + 2.5rem) 0 4rem\', textAlign: \'center\', position: \'relative\', overflow: \'hidden\' }}>';
const projEnd = '</div>\n      </div>';
const projNew = `<SubPageHero3D>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: '#fff' }}>{t('projects.title')}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{lang === 'vi' ? \`Các dự án tự động hóa tiêu biểu \${appName} đã triển khai\` : \`Featured automation projects implemented by \${appName}\`}</p>
      </SubPageHero3D>`;

if (replaceBlock(projectsFile, projStart, projEnd, projNew)) {
  console.log('Fixed Projects Page Hero!');
} else {
  console.log('Failed to fix Projects Page Hero');
}

// 3. Fix Documents Page
const documentsFile = 'frontend/src/app/(public)/documents/page.jsx';
addImport(documentsFile, "import SubPageHero3D from '../../../components/common/SubPageHero3D';");
const docStart = '<div style={{ background: \'linear-gradient(135deg, #0A0A0A, #1A0800)\', padding: \'calc(var(--nav-height) + 2.5rem) 0 4rem\', textAlign: \'center\', position: \'relative\', overflow: \'hidden\' }}>';
const docEnd = '</div>\n      </div>';
const docNew = `<SubPageHero3D>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>{t('courses.title')}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{t('courses.sub')}</p>
      </SubPageHero3D>`;

if (replaceBlock(documentsFile, docStart, docEnd, docNew)) {
  console.log('Fixed Documents Page Hero!');
} else {
  console.log('Failed to fix Documents Page Hero');
}

// 4. Fix Contact Page
const contactFile = 'frontend/src/app/(public)/contact/page.jsx';
addImport(contactFile, "import SubPageHero3D from '../../../components/common/SubPageHero3D';");
const contactStart = '<div style={{ background: \'linear-gradient(135deg, #0A0A0A, #1A0800)\', padding: \'calc(var(--nav-height) + 2.5rem) 0 4rem\', textAlign: \'center\', position: \'relative\', overflow: \'hidden\' }}>';
const contactEnd = '</div>\n      </div>';
const contactNew = `<SubPageHero3D>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
          {t('contact.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{t('contact.sub')}</p>
      </SubPageHero3D>`;

if (replaceBlock(contactFile, contactStart, contactEnd, contactNew)) {
  console.log('Fixed Contact Page Hero!');
} else {
  console.log('Failed to fix Contact Page Hero');
}
