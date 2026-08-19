const fs = require('fs');

// Fix modal footers: rename button labels + use justify-content: space-between for even spacing
const fixes = [
  {
    file: 'frontend/src/app/admin/(panel)/courses/page.jsx',
    old: `>Lưu Tài liệu</button>`,
    new: `>Lưu</button>`,
  },
  {
    file: 'frontend/src/app/admin/(panel)/products/page.jsx',
    old: `>Lưu Sản phẩm</button>`,
    new: `>Lưu</button>`,
  },
  {
    file: 'frontend/src/app/admin/(panel)/projects/page.jsx',
    old: `>Lưu Dự án</button>`,
    new: `>Lưu</button>`,
  },
  {
    file: 'frontend/src/app/admin/(panel)/partners/page.jsx',
    old: `>Lưu Đối tác</button>`,
    new: `>Lưu</button>`,
  },
  {
    file: 'frontend/src/app/admin/(panel)/services/page.jsx',
    old: `>Lưu Dịch vụ</button>`,
    new: `>Lưu</button>`,
  },
  {
    file: 'frontend/src/app/admin/(panel)/banners/page.jsx',
    old: `>Lưu Banner</button>`,
    new: `>Lưu</button>`,
  },
];

// Also fix the footer div to use justify-content: space-between instead of flex-end
// Current pattern: style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', ...
// But Xóa button has marginRight: 'auto' to push it left.
// Better: use justify-content: space-between on the footer

// Fix 1: rename buttons
for (const { file, old: OLD, new: NEW } of fixes) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes(OLD)) {
    c = c.split(OLD).join(NEW);
    fs.writeFileSync(file, c, 'utf8');
    console.log('✓ Renamed button in:', file.split('/').at(-2));
  }
}

// Fix 2: Change modal footer flex to space-between, remove marginRight: 'auto' from Xóa button
const pagesWithDelete = [
  'frontend/src/app/admin/(panel)/courses/page.jsx',
  'frontend/src/app/admin/(panel)/products/page.jsx',
  'frontend/src/app/admin/(panel)/projects/page.jsx',
  'frontend/src/app/admin/(panel)/partners/page.jsx',
];

const OLD_MARGIN = `marginRight: 'auto' }}`;
const NEW_MARGIN = `}}`;
const OLD_FLEX_END = `justifyContent: 'flex-end', gap: '0.75rem'`;
const NEW_FLEX_END = `justifyContent: 'space-between', gap: '0.75rem'`;

for (const file of pagesWithDelete) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (c.includes(OLD_MARGIN)) {
    c = c.split(OLD_MARGIN).join(NEW_MARGIN);
    changed = true;
  }
  if (c.includes(OLD_FLEX_END)) {
    c = c.split(OLD_FLEX_END).join(NEW_FLEX_END);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('✓ Footer spacing fixed in:', file.split('/').at(-2));
  }
}

console.log('Done!');
