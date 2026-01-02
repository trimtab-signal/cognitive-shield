/**
 * MODULE STORE
 * Manages installed modules, enabled state, and execution context
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GeodesicModule,
  ModuleStore as ModuleStoreType,
  ModuleExecutionContext,
} from '../types/module.types';

interface ModuleStoreActions {
  installModule: (module: GeodesicModule) => void;
  uninstallModule: (moduleId: string) => void;
  enableModule: (moduleId: string) => void;
  disableModule: (moduleId: string) => void;
  updateModule: (moduleId: string, updates: Partial<GeodesicModule>) => void;
  setActiveContext: (context: ModuleExecutionContext | null) => void;
  getModule: (moduleId: string) => GeodesicModule | undefined;
  getEnabledModules: () => GeodesicModule[];
}

interface ModuleStore extends ModuleStoreType, ModuleStoreActions {}

const initialState: ModuleStoreType = {
  installedModules: [],
  enabledModuleIds: [],
  activeModuleContext: null,
};

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      installModule: (module: GeodesicModule) => {
        set((state) => {
          // Check if already installed
          if (state.installedModules.some((m) => m.id === module.id)) {
            return state; // Already installed
          }

          return {
            installedModules: [...state.installedModules, module],
            enabledModuleIds: module.isEnabled
              ? [...state.enabledModuleIds, module.id]
              : state.enabledModuleIds,
          };
        });
      },

      uninstallModule: (moduleId: string) => {
        set((state) => ({
          installedModules: state.installedModules.filter((m) => m.id !== moduleId),
          enabledModuleIds: state.enabledModuleIds.filter((id) => id !== moduleId),
          activeModuleContext:
            state.activeModuleContext?.moduleId === moduleId ? null : state.activeModuleContext,
        }));
      },

      enableModule: (moduleId: string) => {
        set((state) => {
          if (state.enabledModuleIds.includes(moduleId)) {
            return state; // Already enabled
          }

          return {
            enabledModuleIds: [...state.enabledModuleIds, moduleId],
            installedModules: state.installedModules.map((m) =>
              m.id === moduleId ? { ...m, isEnabled: true } : m
            ),
          };
        });
      },

      disableModule: (moduleId: string) => {
        set((state) => ({
          enabledModuleIds: state.enabledModuleIds.filter((id) => id !== moduleId),
          installedModules: state.installedModules.map((m) =>
            m.id === moduleId ? { ...m, isEnabled: false } : m
          ),
          activeModuleContext:
            state.activeModuleContext?.moduleId === moduleId ? null : state.activeModuleContext,
        }));
      },

      updateModule: (moduleId: string, updates: Partial<GeodesicModule>) => {
        set((state) => ({
          installedModules: state.installedModules.map((m) =>
            m.id === moduleId ? { ...m, ...updates, updatedAt: Date.now() } : m
          ),
        }));
      },

      setActiveContext: (context: ModuleExecutionContext | null) => {
        set({ activeModuleContext: context });
      },

      getModule: (moduleId: string) => {
        return get().installedModules.find((m) => m.id === moduleId);
      },

      getEnabledModules: () => {
        const { installedModules, enabledModuleIds } = get();
        return installedModules.filter((m) => enabledModuleIds.includes(m.id));
      },
    }),
    {
      name: 'cognitive-shield-modules',
      partialize: (state) => ({
        installedModules: state.installedModules,
        enabledModuleIds: state.enabledModuleIds,
        // Don't persist activeModuleContext (runtime only)
      }),
    }
  )
);

