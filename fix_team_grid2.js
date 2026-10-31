const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/company/page.jsx';
let c = fs.readFileSync(file, 'utf8');

const teamStart = c.indexOf("activeTab === 'team'");
const teamEnd = c.indexOf("activeTab === 'certs'");

if (teamStart !== -1 && teamEnd !== -1) {
  let teamSection = c.substring(teamStart, teamEnd);
  teamSection = teamSection.replace(/gridTemplateColumns:\s*'1fr 1fr'/g, "gridTemplateColumns: '1fr'");
  c = c.substring(0, teamStart) + teamSection + c.substring(teamEnd);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed Team Grid successfully');
} else {
  console.log('Bounds not found');
}
