/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { get, set, update } from 'idb-keyval';
import type { ProcessedMessage } from '../types';
import type { HumanOSType } from '../config/god.config';

const HISTORY_KEY = 'shield_history';

export interface HistoryFilter {
  startDate?: Date;
  endDate?: Date;
  minVoltage?: number;
  maxVoltage?: number;
  senderOS?: HumanOSType;
  searchText?: string;
}

export const HistoryService = {
  /**
   * Save a processed message to history
   */
  async saveMessage(message: ProcessedMessage): Promise<void> {
    await update(HISTORY_KEY, (val: ProcessedMessage[] | undefined) => {
      const history = val || [];
      // Prevent duplicates by ID if necessary, or just append
      return [message, ...history];
    });
  },

  /**
   * Get all messages
   */
  async getAllMessages(): Promise<ProcessedMessage[]> {
    const messages = await get<ProcessedMessage[]>(HISTORY_KEY);
    return messages || [];
  },

  /**
   * Get filtered messages
   */
  async getMessages(filter: HistoryFilter): Promise<ProcessedMessage[]> {
    const allMessages = await this.getAllMessages();
    
    return allMessages.filter(msg => {
      if (filter.startDate && new Date(msg.processedAt) < filter.startDate) return false;
      if (filter.endDate && new Date(msg.processedAt) > filter.endDate) return false;
      
      if (filter.minVoltage !== undefined && msg.voltage.score < filter.minVoltage) return false;
      if (filter.maxVoltage !== undefined && msg.voltage.score > filter.maxVoltage) return false;
      
      if (filter.senderOS && msg.senderOS !== filter.senderOS) return false;
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        const contentMatch = msg.raw.content.toLowerCase().includes(searchLower);
        const summaryMatch = msg.safeSummary.toLowerCase().includes(searchLower);
        return contentMatch || summaryMatch;
      }
      
      return true;
    });
  },

  /**
   * Clear history
   */
  async clearHistory(): Promise<void> {
    await set(HISTORY_KEY, []);
  },

  /**
   * Export history as JSON
   */
  async exportHistory(): Promise<string> {
    const messages = await this.getAllMessages();
    return JSON.stringify(messages, null, 2);
  }
};
