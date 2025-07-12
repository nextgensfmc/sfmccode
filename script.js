
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(div => div.style.display = 'none');
  document.getElementById(tab + 'Tab').style.display = 'block';
}
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
function run(type) {
  const code = document.getElementById(type + 'Code').value;
  let output = '';
  let log = '';
  try {
    if (!code.trim()) throw new Error('Code is empty');
    if (type === 'json') {
      const parsed = JSON.parse(code);
      output = JSON.stringify(parsed, null, 2);
      log = '✅ Valid JSON';
    } else {
      output = '// Simulated Output\n' + code;
      log = '✅ Executed Successfully';
    }
  } catch (e) {
    output = '// Error Output';
    log = '❌ ' + e.message;
  }
  document.getElementById(type + 'Out').innerText = output;
  document.getElementById(type + 'Log').innerText = log;
}
