import enquirer from 'enquirer';
import figlet from 'figlet';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import { sleep } from '../utils/index.js';

// Import tools
import GenerateStealth from './GenerateStealth.js';
import BulkDonate from './BulkDonate.js';
import ScanDonations from './ScanDonations.js';
import ExportData from './ExportData.js';
import HardwareStatus from './HardwareStatus.js';
import QuantumOps from './QuantumOps.js';

// Available tools
const tools = [
  GenerateStealth,
  BulkDonate,
  ScanDonations,
  ExportData,
  HardwareStatus,
  QuantumOps,
];

// Primary program entry point
export const Main = async () => {
  // Print banner
  await printHeader();

  // Display main menu
  const tool = await Menu.run();
  const result = await runTool(tool);

  // Handle results
  if (result) {
    if (result.export) {
      const filename = `phenix-export-${Date.now()}.json`;
      await fs.writeFile(filename, JSON.stringify(result.data, null, 2));
      console.log(chalk.green(`✅ Exported to ${filename}`));
    } else {
      console.log(result);
    }
  }
};

// CLI Menu
const Menu = new enquirer.Select({
  name: 'Main Menu',
  message: chalk.cyan('🐦‍🔥 Phenix Donation Wallet CLI - What would you like to do?'),
  choices: tools.map(tool => ({
    name: tool.name,
    message: tool.description,
    value: tool.name
  })),
});

// Print ASCII art banner
const printHeader = async () => {
  return new Promise((resolve) => {
    figlet('Phenix Wallet', (err, header) => {
      console.log(chalk.magenta(header));
      console.log(chalk.gray('\t\tPrivacy-Preserving Donations 🛡️\n'));
      resolve();
    });
  });
};

// Run selected tool
const runTool = async (toolName) => {
  const tool = tools.find(t => t.name === toolName);
  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }

  const spinner = ora(`Running ${tool.name}...`).start();

  try {
    const result = await tool.run();
    spinner.succeed(`${tool.name} completed`);
    return result;
  } catch (error) {
    spinner.fail(`${tool.name} failed: ${error.message}`);
    throw error;
  }
};