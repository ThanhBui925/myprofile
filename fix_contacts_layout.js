const fs = require('fs');
const contactsFile = 'frontend/src/app/admin/(panel)/contacts/page.jsx';
if (fs.existsSync(contactsFile)) {
  let c = fs.readFileSync(contactsFile, 'utf8');
  
  // Previous fix was:
  // `<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.25rem' }}>
  //          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>Cập nhật trạng thái:</p>`
  
  // I need to change it so "Cập nhật trạng thái:" is on top, and the 3 buttons are below it in a flex row.
  const oldStr = `<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>Cập nhật trạng thái:</p>`;
            
  const newStr = `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Cập nhật trạng thái:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>`;

  // We also need to add the closing `</div>` for the grid before the end of the outer div.
  // The outer div ends right after the map.
  
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    
    // Fix the padding and text align of the buttons to make them look good in a grid
    c = c.replace(/padding: '0.4rem 0.6rem', whiteSpace: 'nowrap'/g, "padding: '0.5rem', whiteSpace: 'nowrap', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'");
    
    // Add the closing div for the grid
    // Find:
    //   </button>
    // ))}
    // </div>
    const endStr = `</button>
          ))}
        </div>`;
    const newEndStr = `</button>
            ))}
            </div>
        </div>`;
        
    c = c.replace(endStr, newEndStr);
    fs.writeFileSync(contactsFile, c, 'utf8');
    console.log('Fixed Contacts Modal Status Layout');
  } else {
    console.log('Contacts Modal pattern not found.');
  }
}
