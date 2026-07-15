const { execSync } = require('child_process');

try {
  execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
