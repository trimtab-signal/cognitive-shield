/**
 * CLI Utilities
 * Helper functions for the Phenix Wallet CLI
 */

import { ethers } from 'ethers';

// Sleep utility
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Format ETH amount
export const formatEth = (wei) => {
  return ethers.formatEther(wei) + ' ETH';
};

// Format address with ellipsis
export const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validate Ethereum address
export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

// Generate timestamp
export const getTimestamp = () => {
  return new Date().toISOString();
};

// Pretty print JSON
export const prettyPrint = (obj) => {
  return JSON.stringify(obj, null, 2);
};