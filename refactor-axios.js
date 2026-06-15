const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplace(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:8080/api')) {
        // Replace imports
        if (content.includes("import axios from 'axios';")) {
          content = content.replace("import axios from 'axios';", "import axiosClient from '@/lib/axiosClient';");
        } else {
          content = `import axiosClient from '@/lib/axiosClient';\n` + content;
          // remove duplicate standard axios import if any
          content = content.replace(/import axios from 'axios';\n?/g, '');
        }

        // Replace urls
        content = content.replace(/axios\.get\(`http:\/\/localhost:8080\/api/g, 'axiosClient.get(`');
        content = content.replace(/axios\.post\(`http:\/\/localhost:8080\/api/g, 'axiosClient.post(`');
        content = content.replace(/axios\.get\('http:\/\/localhost:8080\/api/g, "axiosClient.get('");
        content = content.replace(/axios\.post\('http:\/\/localhost:8080\/api/g, "axiosClient.post('");

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

findAndReplace(directoryPath);

// Specific fix for NotificationProvider websocket
const notifFile = path.join(__dirname, 'src', 'components', 'NotificationProvider.tsx');
let notifContent = fs.readFileSync(notifFile, 'utf8');
notifContent = notifContent.replace(
  "const socket = new SockJS('http://localhost:8080/ws');",
  "const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/ws`);"
);
fs.writeFileSync(notifFile, notifContent, 'utf8');
console.log('Updated WebSocket URL in NotificationProvider');
