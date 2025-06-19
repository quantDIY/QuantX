import React, { useState } from 'react';
import AccountSelect from './components/AccountSelect';

function Setup({ onCompleted }) {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const result = await window.electron.saveConfig({ USERNAME: username, API_KEY: apiKey });
      if (result.status !== 'ok') {
        throw new Error(result.message || 'Failed to save credentials.');
      }

      const resp = await window.electron.searchAccounts();
      const accList = Array.isArray(resp?.accounts) ? resp.accounts : resp;
      setAccounts(accList);
    } catch (err) {
      console.error("Setup failed:", err);
      setError(err.message || 'Something went wrong.');
    }
  };

  if (Array.isArray(accounts) && accounts.length > 0) {
    return (
      <AccountSelect
        accounts={accounts}
        onSelect={async (id) => {
          await window.electron.saveConfig({ ACCOUNT_ID: id });
          onCompleted();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-500">QuantX for TopstepX</h1>
      <input
        className="w-full p-2 border rounded"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)} />
      <input
        className="w-full p-2 border rounded"
        placeholder="API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)} />
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
        <span>Remember</span>
      </label>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {Array.isArray(accounts) && accounts.length === 0 && (
        <p className="text-red-500 mt-4 text-center">No accounts found — check your credentials.</p>
      )}
    </form>
  );
}

export default Setup;
