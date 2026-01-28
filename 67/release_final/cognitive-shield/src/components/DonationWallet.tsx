/*
 * AGPLv3 License - See LICENSE file for details
 * Privacy Notice: All wallet keys are generated locally and never leave your device.
 * No external calls or data sharing. For compliance, see LEGAL_TOOLKIT_GUIDE.md.
 */
import React, { useState } from 'react';

// Simple demo: generate and display a stealth donation address
function generateRandomHex(length: number) {
  const bytes = new Uint8Array(length / 2);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    // Fallback for Node.js
    // @ts-ignore
    require('crypto').randomFillSync(bytes);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function DonationWallet() {
  const [metaAddress, setMetaAddress] = useState<string | null>(null);
  const [stealthAddress, setStealthAddress] = useState<string | null>(null);
  const [ephemeralPubKey, setEphemeralPubKey] = useState<string | null>(null);
  const [viewTag, setViewTag] = useState<string | null>(null);

  function generateWallet() {
    const spendingPubKey = generateRandomHex(64);
    const viewingPubKey = generateRandomHex(64);
    const meta = `st:eth:0x${spendingPubKey}${viewingPubKey}`;
    setMetaAddress(meta);
    // Generate stealth address
    const ephemeral = generateRandomHex(64);
    const view = generateRandomHex(2);
    const stealth = '0x' + generateRandomHex(40);
    setStealthAddress(stealth);
    setEphemeralPubKey(ephemeral);
    setViewTag(view);
  }

  return (
    <div style={{background: 'rgba(0,0,32,0.7)', borderRadius: 16, padding: 24, color: '#fff', margin: '24px 0'}}>
      <h2 style={{marginBottom: 12}}>Donation Wallet (Stealth Address)</h2>
      <div style={{marginBottom: 8, fontSize: 13, color: '#b3eaff'}}>
        <strong>Privacy:</strong> All keys generated locally. No data leaves your device.<br/>
        <strong>Legal:</strong> See LEGAL_TOOLKIT_GUIDE.md and AGPLv3 license for compliance.
      </div>
      <button onClick={generateWallet} style={{padding: '8px 16px', borderRadius: 8, background: '#6c47ff', color: '#fff', border: 'none', cursor: 'pointer'}}>Generate Wallet</button>
      {metaAddress && (
        <div style={{marginTop: 16}}>
          <div><strong>Stealth Meta-Address:</strong> <span style={{wordBreak: 'break-all'}}>{metaAddress}</span></div>
          <div><strong>Stealth Donation Address:</strong> <span style={{wordBreak: 'break-all'}}>{stealthAddress}</span></div>
          <div><strong>Ephemeral Public Key:</strong> <span style={{wordBreak: 'break-all'}}>{ephemeralPubKey}</span></div>
          <div><strong>View Tag:</strong> <span>{viewTag}</span></div>
        </div>
      )}
    </div>
  );
}
