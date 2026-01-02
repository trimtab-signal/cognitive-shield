/**
 * DEEP PROCESSING QUEUE
 * Displays gated messages for low-status days
 */

import { Clock, ArrowUp, Trash2 } from 'lucide-react';
import type { ProcessedPayload } from '../types/shield.types';
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';
import ProcessedPayloadCard from './ProcessedPayloadCard';

interface DeepProcessingQueueProps {
  queue: readonly ProcessedPayload[];
}

export function DeepProcessingQueue({ queue }: DeepProcessingQueueProps) {
  const { promoteFromDeepQueue, clearDeepQueue } = useShieldStore();

  if (queue.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `2px solid ${GOD_CONFIG.voltage.medium.color}40`,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${GOD_CONFIG.voltage.medium.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={20} color={GOD_CONFIG.voltage.medium.color} />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 2,
              }}
            >
              Deep Processing Queue
            </div>
            <div
              style={{
                fontSize: 11,
                color: GOD_CONFIG.theme.text.muted,
              }}
            >
              {queue.length} message{queue.length !== 1 ? 's' : ''} gated for tomorrow
            </div>
          </div>
        </div>
        <button
          onClick={clearDeepQueue}
          style={{
            padding: '6px 12px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.muted,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Trash2 size={12} />
          Clear All
        </button>
      </div>

      <div
        style={{
          padding: 12,
          backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 12,
          color: GOD_CONFIG.theme.text.primary,
          lineHeight: 1.6,
        }}
      >
        These messages were automatically gated because your daily check-in status is below 25% and
        they have a high spoon cost (3+). They will be available for processing when your status
        improves, or you can promote them manually.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {queue.map((payload) => (
          <div
            key={payload.id}
            style={{
              padding: 14,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <ProcessedPayloadCard
                payload={payload}
                onDismiss={() => {}}
                onNeedSupport={() => {}}
              />
            </div>
            <button
              onClick={() => promoteFromDeepQueue(payload.id)}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: GOD_CONFIG.voltage.low.color,
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ArrowUp size={14} />
              Promote to Processed (Ready to View)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeepProcessingQueue;

