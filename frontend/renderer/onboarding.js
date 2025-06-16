const form = document.getElementById('onboarding-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const apiKey = document.getElementById('apiKey').value;
  const username = document.getElementById('username').value;
  const accountId = document.getElementById('accountId').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (rememberMe) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('username', username);
    localStorage.setItem('accountId', accountId);
  }

  window.electronAPI.completeOnboarding({ apiKey, username, accountId });
});
