import React from 'react';

function AccountSelect({ accounts, onSelect }) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Select Lead Account</h2>
      <select
        className="w-full p-2 border rounded"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select an account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AccountSelect;
