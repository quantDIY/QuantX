import React, { useState, useEffect } from 'react';

function App() {
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [testOutput, setTestOutput] = useState('');
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  useEffect(() => {
    window.electron.getEnv().then(env => {
      const defaultId = env.ACCOUNT_ID || '';
      setAccountId(defaultId);

      window.electron.searchAccounts().then(fetchedAccounts => {
        console.log("Fetched accounts:", fetchedAccounts);
        setAccounts(fetchedAccounts);
        if (!defaultId && fetchedAccounts.length) {
          setAccountId(fetchedAccounts[0].id.toString());
        }
      }).catch(err => console.error("Failed to fetch accounts:", err));
    });
  }, []);

  const handleTest = async () => {
    setAllTestsPassed(false);
    setTestOutput('Running tests...');
    const result = await window.electron.runTests();
    setTestOutput(result.output);
    if (result.success) {
      setTimeout(() => setAllTestsPassed(true), 500);
    }
  };

  const handleAccountChange = async (e) => {
    const id = e.target.value;
    console.log("Changing account to", id);
    setAccountId(id);
    await window.electron.saveConfig({ ACCOUNT_ID: id });
  };

  if (allTestsPassed) {
    return (
      <div className="text-center p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">All tests have passed successfully</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Launch QuantX</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center justify-start h-full p-8">
        <h1 className="text-xl font-semibold mb-4">Welcome to QuantX</h1>
        <h2 className="text-lg mb-4 text-center max-w-2xl">
          Press Test below to confirm QuantX connectivity to all TopstepX API Endpoints.
          Be sure you have selected a practice account for testing.
        </h2>
        <div className="mb-4">
          {accounts.length ? (
            <select value={accountId} onChange={handleAccountChange} className="p-2 border rounded">
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id.toString()}>{acc.name}</option>
              ))}
            </select>
          ) : (
            <span>No accounts found – please ensure server returned accounts</span>
          )}
          <button onClick={handleTest} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
            Test
          </button>
        </div>
        <pre className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded max-w-2xl w-full whitespace-pre-wrap">
          {testOutput}
        </pre>
      </div>
    </div>
  );
}

export default App;

