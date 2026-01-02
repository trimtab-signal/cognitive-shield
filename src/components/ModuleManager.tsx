/**
 * MODULE MANAGER
 * UI for managing installed modules (list, enable/disable, uninstall)
 */

import { useState, useMemo } from 'react';
import { Package, Power, Trash2, Code2, AlertTriangle, CheckCircle2, XCircle, Eye, Settings, Key } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { useModuleStore } from '../store/module.store';
import ModuleAbdication from './ModuleAbdication';
import type { GeodesicModule } from '../types/module.types';

export function ModuleManager() {
  const { installedModules, enabledModuleIds, enableModule, disableModule, uninstallModule } = useModuleStore();
  const [selectedModule, setSelectedModule] = useState<GeodesicModule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAbdication, setShowAbdication] = useState<GeodesicModule | null>(null);

  const enabledModules = useMemo(
    () => installedModules.filter((m) => enabledModuleIds.includes(m.id)),
    [installedModules, enabledModuleIds]
  );

  const disabledModules = useMemo(
    () => installedModules.filter((m) => !enabledModuleIds.includes(m.id)),
    [installedModules, enabledModuleIds]
  );

  const handleToggle = (module: GeodesicModule) => {
    if (module.isEnabled) {
      disableModule(module.id);
    } else {
      enableModule(module.id);
    }
  };

  const handleUninstall = (moduleId: string) => {
    uninstallModule(moduleId);
    setShowDeleteConfirm(null);
    if (selectedModule?.id === moduleId) {
      setSelectedModule(null);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: GOD_CONFIG.theme.text.primary,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Package size={28} /> Module Manager
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
          Manage your installed modules. Enable, disable, or uninstall as needed.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Total Modules</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>
            {installedModules.length}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
          }}
        >
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Enabled</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
            }}
          >
            {enabledModules.length}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Disabled</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: GOD_CONFIG.theme.text.muted }}>
            {disabledModules.length}
          </div>
        </div>
      </div>

      {/* Module Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Enabled Modules */}
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={14} /> ENABLED MODULES ({enabledModules.length})
          </div>
          {enabledModules.length === 0 ? (
            <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic' }}>
              No enabled modules
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enabledModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onToggle={() => handleToggle(module)}
                  onView={() => setSelectedModule(module)}
                  onDelete={() => setShowDeleteConfirm(module.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Disabled Modules */}
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.muted,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <XCircle size={14} /> DISABLED MODULES ({disabledModules.length})
          </div>
          {disabledModules.length === 0 ? (
            <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic' }}>
              No disabled modules
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {disabledModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onToggle={() => handleToggle(module)}
                  onView={() => setSelectedModule(module)}
                  onDelete={() => setShowDeleteConfirm(module.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Details Panel */}
      {selectedModule && !showAbdication && (
        <ModuleDetailsPanel
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onAbdicate={() => {
            setShowAbdication(selectedModule);
            setSelectedModule(null);
          }}
        />
      )}

      {/* Abdication Panel */}
      {showAbdication && (
        <ModuleAbdication
          module={showAbdication}
          onComplete={() => {
            setShowAbdication(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: 24,
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              borderRadius: 12,
              border: `1px solid ${GOD_CONFIG.voltage.high.color}`,
              maxWidth: 400,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <AlertTriangle size={24} color={GOD_CONFIG.voltage.high.color} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: GOD_CONFIG.theme.text.primary,
                }}
              >
                Uninstall Module?
              </h3>
            </div>
            <p style={{ fontSize: 14, color: GOD_CONFIG.theme.text.secondary, marginBottom: 20 }}>
              This will permanently remove the module from your system. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 8,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUninstall(showDeleteConfirm)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: GOD_CONFIG.voltage.high.color,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Uninstall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  module,
  onToggle,
  onView,
  onDelete,
}: {
  module: GeodesicModule;
  onToggle: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const statusColor = module.isEnabled
    ? GOD_CONFIG.heartbeat.statuses.green.color
    : GOD_CONFIG.theme.text.muted;
  const linterStatus = module.linterReport.isStable
    ? GOD_CONFIG.heartbeat.statuses.green.color
    : GOD_CONFIG.voltage.high.color;

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        borderRadius: 8,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Code2 size={16} />
            {module.name}
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, marginBottom: 8 }}>
            {module.description}
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
            <span>v{module.version}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: linterStatus,
                }}
              />
              {module.linterReport.isStable ? 'Stable' : 'Violations'}
            </span>
            <span>•</span>
            <span>{module.linterReport.spoonCost} spoons</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onView}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={onToggle}
            style={{
              padding: '6px 12px',
              backgroundColor: module.isEnabled ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${statusColor}`,
              borderRadius: 6,
              color: module.isEnabled ? '#fff' : GOD_CONFIG.theme.text.primary,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            title={module.isEnabled ? 'Disable' : 'Enable'}
          >
            <Power size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
              borderRadius: 6,
              color: GOD_CONFIG.voltage.high.color,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            title="Uninstall"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ModuleDetailsPanel({ module, onClose }: { module: GeodesicModule; onClose: () => void }) {
  return (
    <div
      style={{
        padding: 24,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: GOD_CONFIG.theme.text.primary,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}
        >
          {module.name}
        </h3>
        <button
          onClick={onClose}
          style={{
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Description</div>
          <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>{module.description}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Version</div>
            <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>{module.version}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Author</div>
            <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>{module.author}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Resonance Score</div>
            <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>
              {module.linterReport.resonanceScore.toFixed(3)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>Spoon Cost</div>
            <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>
              {module.linterReport.spoonCost}
            </div>
          </div>
        </div>

        {module.linterReport.violations.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>Violations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {module.linterReport.violations.map((violation, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    borderRadius: 8,
                    borderLeft: `3px solid ${
                      violation.severity === 'error'
                        ? GOD_CONFIG.voltage.high.color
                        : violation.severity === 'warning'
                        ? GOD_CONFIG.voltage.medium.color
                        : GOD_CONFIG.theme.border.default
                    }`,
                  }}
                >
                  <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>{violation.message}</div>
                  {violation.suggestion && (
                    <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, marginTop: 4 }}>
                      💡 {violation.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {module.abdicated && (
          <div
            style={{
              padding: 12,
              backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}15`,
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
              fontSize: 12,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
            }}
          >
            ✓ Module is abdicated. Update keys have been destroyed.
          </div>
        )}

        {!module.abdicated && (
          <button
            onClick={onAbdicate}
            style={{
              marginTop: 16,
              padding: '10px 20px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
              borderRadius: 8,
              color: GOD_CONFIG.voltage.high.color,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Key size={16} />
            Abdicate Module
          </button>
        )}
      </div>
    </div>
  );
}

export default ModuleManager;

