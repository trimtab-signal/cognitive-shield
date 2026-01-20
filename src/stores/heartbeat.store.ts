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

/**
 * Heartbeat Store
 * Operator state management (Node A)
 * 
 * Manages: spoon count, heartbeat status, stress indicators, deep processing lock
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { HeartbeatState, HeartbeatActions, OperatorState } from '../types';
import type { HeartbeatStatus } from '../config/god.config';
import { MetabolismConfig, HeartbeatConfig } from '../config/god.config';

interface HeartbeatStore extends HeartbeatState, HeartbeatActions {}

const getHeartbeatStatus = (percent: number): HeartbeatStatus => {
  if (percent >= HeartbeatConfig.thresholds.green) return 'green';
  if (percent >= HeartbeatConfig.thresholds.yellow) return 'yellow';
  if (percent >= HeartbeatConfig.thresholds.orange) return 'orange';
  return 'red';
};

const initialOperatorState: OperatorState = {
  spoons: MetabolismConfig.maxSpoons,
  maxSpoons: MetabolismConfig.maxSpoons,
  heartbeat: 'green',
  heartbeatPercent: 100,
  deepProcessingLock: false,
  lastCheckIn: new Date(),
  stressIndicators: {
    physicalTension: 0,
    mentalLoad: 0,
    emotionalState: 0,
  },
};

export const useHeartbeatStore = create<HeartbeatStore>()(
  devtools(
    persist(
      (set, get) => ({
        operator: initialOperatorState,

        /**
         * Update spoon count by delta (positive or negative)
         */
        updateSpoons: (delta: number) => {
          const { operator } = get();
          const newSpoons = Math.max(0, Math.min(operator.maxSpoons, operator.spoons + delta));
          const heartbeatPercent = (newSpoons / operator.maxSpoons) * 100;
          const heartbeat = getHeartbeatStatus(heartbeatPercent);
          const deepProcessingLock = heartbeatPercent < HeartbeatConfig.lockoutThreshold;

          set({
            operator: {
              ...operator,
              spoons: newSpoons,
              heartbeatPercent,
              heartbeat,
              deepProcessingLock,
            },
          });
        },

        /**
         * Set spoons to specific value
         */
        setSpoons: (value: number) => {
          const { operator } = get();
          const newSpoons = Math.max(0, Math.min(operator.maxSpoons, value));
          const heartbeatPercent = (newSpoons / operator.maxSpoons) * 100;
          const heartbeat = getHeartbeatStatus(heartbeatPercent);
          const deepProcessingLock = heartbeatPercent < HeartbeatConfig.lockoutThreshold;

          set({
            operator: {
              ...operator,
              spoons: newSpoons,
              heartbeatPercent,
              heartbeat,
              deepProcessingLock,
            },
          });
        },

        /**
         * Perform heartbeat check-in
         */
        checkIn: (status: Partial<OperatorState>) => {
          const { operator } = get();
          const updatedOperator = {
            ...operator,
            ...status,
            lastCheckIn: new Date(),
          };

          // Recalculate derived values
          const heartbeatPercent = (updatedOperator.spoons / updatedOperator.maxSpoons) * 100;
          const heartbeat = getHeartbeatStatus(heartbeatPercent);
          const deepProcessingLock = heartbeatPercent < HeartbeatConfig.lockoutThreshold;

          set({
            operator: {
              ...updatedOperator,
              heartbeatPercent,
              heartbeat,
              deepProcessingLock,
            },
          });
        },

        /**
         * Toggle deep processing lock manually
         */
        toggleDeepProcessingLock: (locked: boolean) => {
          set((state) => ({
            operator: {
              ...state.operator,
              deepProcessingLock: locked,
            },
          }));
        },

        /**
         * Update stress indicators
         */
        updateStress: (indicators: Partial<OperatorState['stressIndicators']>) => {
          set((state) => ({
            operator: {
              ...state.operator,
              stressIndicators: {
                ...state.operator.stressIndicators,
                ...indicators,
              },
            },
          }));
        },
      }),
      {
        name: 'heartbeat-store',
        partialize: (state) => ({
          operator: {
            spoons: state.operator.spoons,
            maxSpoons: state.operator.maxSpoons,
            lastCheckIn: state.operator.lastCheckIn,
          },
        }),
      }
    ),
    { name: 'HeartbeatStore' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get current spoon count */
export const useSpoons = () => useHeartbeatStore((state) => state.operator.spoons);

/** Get heartbeat status */
export const useHeartbeatStatus = () => useHeartbeatStore((state) => state.operator.heartbeat);

/** Get heartbeat percentage */
export const useHeartbeatPercent = () => useHeartbeatStore((state) => state.operator.heartbeatPercent);

/** Check if deep processing lock is active */
export const useIsLocked = () => useHeartbeatStore((state) => state.operator.deepProcessingLock);

/** Get stress indicators */
export const useStressIndicators = () => useHeartbeatStore((state) => state.operator.stressIndicators);

/** Get full operator state */
export const useOperator = () => useHeartbeatStore((state) => state.operator);

/** Check if operator can handle a task with given spoon cost */
export const useCanHandle = (cost: number) => 
  useHeartbeatStore((state) => state.operator.spoons >= cost && !state.operator.deepProcessingLock);

/** Get color for current heartbeat status */
export const useHeartbeatColor = () => {
  const status = useHeartbeatStatus();
  return HeartbeatConfig.colors[status];
};
