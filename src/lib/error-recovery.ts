/**
 * COMPREHENSIVE ERROR HANDLING & RECOVERY SYSTEM
 * Enterprise-grade error management with automatic recovery and user feedback
 *
 * Features:
 * - Hierarchical error classification and handling
 * - Automatic retry with exponential backoff
 * - Graceful degradation strategies
 * - User-friendly error messages
 * - Error reporting and analytics
 * - Recovery workflows and user guidance
 * - Circuit breaker pattern integration
 */

import { robustAnnouncementScanner } from './robust-scanner';

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR TYPES & CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export enum ErrorCategory {
  NETWORK = 'network',
  CRYPTOGRAPHIC = 'cryptographic',
  STORAGE = 'storage',
  VALIDATION = 'validation',
  HARDWARE = 'hardware',
  PERMISSION = 'permission',
  RATE_LIMIT = 'rate_limit',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',       // Minor issues, operation can continue
  MEDIUM = 'medium', // Notable errors, may affect functionality
  HIGH = 'high',     // Critical errors, operation significantly impacted
  CRITICAL = 'critical' // System-breaking errors, requires immediate attention
}

export interface WalletError {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  context?: {
    operation?: string;
    userId?: string;
    networkId?: string;
    component?: string;
  };
  stack?: string;
  recoverable: boolean;
  recoveryAction?: RecoveryAction;
  retryCount?: number;
  maxRetries?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOVERY ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export enum RecoveryAction {
  RETRY = 'retry',
  RETRY_WITH_BACKOFF = 'retry_with_backoff',
  SWITCH_PROVIDER = 'switch_provider',
  RESET_CONNECTION = 'reset_connection',
  REINITIALIZE = 'reinitialize',
  USER_INTERVENTION = 'user_intervention',
  RESTART_EXTENSION = 'restart_extension',
  NONE = 'none'
}

export interface RecoveryStrategy {
  action: RecoveryAction;
  description: string;
  automatic: boolean;
  userMessage?: string;
  retryDelay?: number;
  maxAttempts?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorHistory: WalletError[] = [];
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private activeRecoveries: Set<string> = new Set();

  private constructor() {
    this.initializeRecoveryStrategies();
    this.setupGlobalErrorHandling();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ERROR CLASSIFICATION & HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Handle an error with classification and recovery
   */
  async handleError(error: Error | any, context?: WalletError['context']): Promise<void> {
    const walletError = this.classifyError(error, context);

    // Log error
    console.error(`[${walletError.category.toUpperCase()}] ${walletError.message}`, {
      id: walletError.id,
      severity: walletError.severity,
      code: walletError.code,
      context: walletError.context
    });

    // Store error history
    this.errorHistory.push(walletError);

    // Limit history size
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-50);
    }

    // Save to storage for analytics
    await this.persistError(walletError);

    // Trigger recovery if applicable
    if (walletError.recoverable && walletError.recoveryAction) {
      await this.attemptRecovery(walletError);
    }

    // Notify user if necessary
    if (walletError.severity === ErrorSeverity.HIGH || walletError.severity === ErrorSeverity.CRITICAL) {
      await this.notifyUser(walletError);
    }
  }

  /**
   * Classify an error into category, severity, and recovery strategy
   */
  private classifyError(error: Error | any, context?: WalletError['context']): WalletError {
    const errorString = error?.message || error?.toString() || 'Unknown error';
    const stack = error?.stack;

    // Network errors
    if (errorString.includes('fetch') || errorString.includes('network') ||
        errorString.includes('RPC') || errorString.includes('timeout')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.NETWORK,
        severity: this.determineNetworkSeverity(errorString),
        code: 'NETWORK_ERROR',
        message: this.sanitizeErrorMessage(errorString),
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: true,
        recoveryAction: RecoveryAction.RETRY_WITH_BACKOFF
      };
    }

    // Cryptographic errors
    if (errorString.includes('crypto') || errorString.includes('key') ||
        errorString.includes('signature') || errorString.includes('decrypt')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.CRYPTOGRAPHIC,
        severity: ErrorSeverity.HIGH,
        code: 'CRYPTO_ERROR',
        message: 'Cryptographic operation failed',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: false,
        recoveryAction: RecoveryAction.USER_INTERVENTION
      };
    }

    // Storage errors
    if (errorString.includes('storage') || errorString.includes('quota') ||
        errorString.includes('localStorage')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.STORAGE,
        severity: ErrorSeverity.MEDIUM,
        code: 'STORAGE_ERROR',
        message: 'Storage operation failed',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: true,
        recoveryAction: RecoveryAction.RESET_CONNECTION
      };
    }

    // Validation errors
    if (errorString.includes('validation') || errorString.includes('invalid') ||
        errorString.includes('schema')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.MEDIUM,
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: true,
        recoveryAction: RecoveryAction.REINITIALIZE
      };
    }

    // Hardware errors
    if (errorString.includes('hardware') || errorString.includes('device') ||
        errorString.includes('USB') || errorString.includes('WebUSB')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.HARDWARE,
        severity: ErrorSeverity.MEDIUM,
        code: 'HARDWARE_ERROR',
        message: 'Hardware device error',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: true,
        recoveryAction: RecoveryAction.USER_INTERVENTION
      };
    }

    // Permission errors
    if (errorString.includes('permission') || errorString.includes('denied')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.PERMISSION,
        severity: ErrorSeverity.HIGH,
        code: 'PERMISSION_ERROR',
        message: 'Permission denied',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: false,
        recoveryAction: RecoveryAction.USER_INTERVENTION
      };
    }

    // Rate limit errors
    if (errorString.includes('rate limit') || errorString.includes('too many requests')) {
      return {
        id: this.generateErrorId(),
        category: ErrorCategory.RATE_LIMIT,
        severity: ErrorSeverity.MEDIUM,
        code: 'RATE_LIMIT_ERROR',
        message: 'Rate limit exceeded',
        details: error,
        timestamp: Date.now(),
        context,
        stack,
        recoverable: true,
        recoveryAction: RecoveryAction.RETRY_WITH_BACKOFF
      };
    }

    // Default unknown error
    return {
      id: this.generateErrorId(),
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      code: 'UNKNOWN_ERROR',
      message: this.sanitizeErrorMessage(errorString),
      details: error,
      timestamp: Date.now(),
      context,
      stack,
      recoverable: true,
      recoveryAction: RecoveryAction.RETRY
    };
  }

  /**
   * Determine network error severity
   */
  private determineNetworkSeverity(errorString: string): ErrorSeverity {
    if (errorString.includes('timeout') || errorString.includes('unreachable')) {
      return ErrorSeverity.HIGH;
    }
    if (errorString.includes('429') || errorString.includes('rate limit')) {
      return ErrorSeverity.MEDIUM;
    }
    return ErrorSeverity.LOW;
  }

  /**
   * Sanitize error messages for security
   */
  private sanitizeErrorMessage(message: string): string {
    // Remove sensitive information
    return message
      .replace(/api[_-]?key[=:]\s*[\w-]+/gi, 'api_key=***')
      .replace(/password[=:]\s*[\w-]+/gi, 'password=***')
      .replace(/private[_-]?key[=:]\s*[\w-]+/gi, 'private_key=***')
      .replace(/0x[a-fA-F0-9]{40}/g, '0x***...***') // Ethereum addresses
      .slice(0, 200); // Limit length
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RECOVERY STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Initialize recovery strategies for different error types
   */
  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies.set('NETWORK_ERROR', {
      action: RecoveryAction.RETRY_WITH_BACKOFF,
      description: 'Retry network operation with exponential backoff',
      automatic: true,
      maxAttempts: 3,
      retryDelay: 1000
    });

    this.recoveryStrategies.set('STORAGE_ERROR', {
      action: RecoveryAction.RESET_CONNECTION,
      description: 'Clear cache and reset storage connection',
      automatic: true,
      userMessage: 'Clearing cache and resetting connections...'
    });

    this.recoveryStrategies.set('VALIDATION_ERROR', {
      action: RecoveryAction.REINITIALIZE,
      description: 'Reinitialize component with default state',
      automatic: true,
      userMessage: 'Resetting component state...'
    });

    this.recoveryStrategies.set('HARDWARE_ERROR', {
      action: RecoveryAction.USER_INTERVENTION,
      description: 'User needs to reconnect hardware device',
      automatic: false,
      userMessage: 'Please reconnect your hardware device and try again.'
    });

    this.recoveryStrategies.set('CRYPTO_ERROR', {
      action: RecoveryAction.USER_INTERVENTION,
      description: 'Cryptographic operation failed - requires user attention',
      automatic: false,
      userMessage: 'Security operation failed. Please contact support if this persists.'
    });

    this.recoveryStrategies.set('RATE_LIMIT_ERROR', {
      action: RecoveryAction.RETRY_WITH_BACKOFF,
      description: 'Wait and retry after rate limit period',
      automatic: true,
      maxAttempts: 5,
      retryDelay: 5000
    });
  }

  /**
   * Attempt automatic recovery for an error
   */
  private async attemptRecovery(walletError: WalletError): Promise<void> {
    if (this.activeRecoveries.has(walletError.id)) {
      console.log('[ErrorHandler] Recovery already in progress for:', walletError.id);
      return;
    }

    this.activeRecoveries.add(walletError.id);

    try {
      const strategy = this.recoveryStrategies.get(walletError.code);
      if (!strategy || !strategy.automatic) {
        return;
      }

      console.log('[ErrorHandler] Attempting recovery:', strategy.description);

      switch (strategy.action) {
        case RecoveryAction.RETRY:
        case RecoveryAction.RETRY_WITH_BACKOFF:
          await this.retryWithBackoff(walletError, strategy);
          break;

        case RecoveryAction.SWITCH_PROVIDER:
          await this.switchProvider(walletError);
          break;

        case RecoveryAction.RESET_CONNECTION:
          await this.resetConnections(walletError);
          break;

        case RecoveryAction.REINITIALIZE:
          await this.reinitializeComponent(walletError);
          break;

        default:
          console.log('[ErrorHandler] No automatic recovery available');
      }

    } catch (recoveryError) {
      console.error('[ErrorHandler] Recovery failed:', recoveryError);
      // Recovery failed - might need user intervention
    } finally {
      this.activeRecoveries.delete(walletError.id);
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryWithBackoff(walletError: WalletError, strategy: RecoveryStrategy): Promise<void> {
    const maxAttempts = strategy.maxAttempts || 3;
    const baseDelay = strategy.retryDelay || 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Calculate delay with exponential backoff and jitter
        const delay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 1000;
        await this.delay(delay + jitter);

        // Attempt recovery based on error context
        if (walletError.context?.operation === 'scan') {
          await robustAnnouncementScanner.triggerScan();
        } else if (walletError.context?.operation === 'rpc_call') {
          // Retry would be handled by the RPC caller
          console.log('[ErrorHandler] RPC retry handled by caller');
        }

        console.log(`[ErrorHandler] Recovery successful on attempt ${attempt}`);
        return;

      } catch (retryError) {
        console.warn(`[ErrorHandler] Recovery attempt ${attempt} failed:`, retryError);

        if (attempt === maxAttempts) {
          throw new Error(`Recovery failed after ${maxAttempts} attempts`);
        }
      }
    }
  }

  /**
   * Switch to a different RPC provider
   */
  private async switchProvider(walletError: WalletError): Promise<void> {
    // This would integrate with the robust scanner to switch providers
    await robustAnnouncementScanner.refreshRpcHealth();
    console.log('[ErrorHandler] Switched RPC provider');
  }

  /**
   * Reset connections and clear caches
   */
  private async resetConnections(walletError: WalletError): Promise<void> {
    // Clear any cached data
    await chrome.storage.local.remove(['rpc_health_cache']);

    // Reset scanner connections
    await robustAnnouncementScanner.refreshRpcHealth();

    console.log('[ErrorHandler] Connections reset');
  }

  /**
   * Reinitialize component with default state
   */
  private async reinitializeComponent(walletError: WalletError): Promise<void> {
    // Reset scanner state
    await robustAnnouncementScanner.initialize();

    console.log('[ErrorHandler] Component reinitialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // USER NOTIFICATIONS & FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Notify user about significant errors
   */
  private async notifyUser(walletError: WalletError): Promise<void> {
    const userMessage = this.getUserFriendlyMessage(walletError);

    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/phenix-128.png',
        title: '🐦‍🔥 Phenix Wallet Issue',
        message: userMessage,
        priority: walletError.severity === ErrorSeverity.CRITICAL ? 2 : 1,
        requireInteraction: walletError.severity === ErrorSeverity.CRITICAL
      });
    } catch (notificationError) {
      console.error('[ErrorHandler] Failed to send notification:', notificationError);
    }
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(walletError: WalletError): string {
    switch (walletError.code) {
      case 'NETWORK_ERROR':
        return 'Network connection issue. Retrying automatically...';

      case 'CRYPTO_ERROR':
        return 'Security operation failed. Please try again or contact support.';

      case 'STORAGE_ERROR':
        return 'Storage issue detected. Attempting to resolve...';

      case 'HARDWARE_ERROR':
        return 'Hardware device disconnected. Please reconnect and try again.';

      case 'PERMISSION_ERROR':
        return 'Permission required. Please grant necessary permissions.';

      case 'RATE_LIMIT_ERROR':
        return 'Too many requests. Waiting before retrying...';

      default:
        return 'An unexpected issue occurred. The system is attempting to recover.';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ERROR ANALYTICS & REPORTING
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Persist error for analytics
   */
  private async persistError(walletError: WalletError): Promise<void> {
    try {
      const errorLog = {
        ...walletError,
        userAgent: navigator.userAgent,
        extensionVersion: chrome.runtime.getManifest().version
      };

      // Store in local storage for now (in production, send to analytics service)
      const stored = await chrome.storage.local.get('error_logs');
      const errorLogs = stored.error_logs || [];

      errorLogs.push(errorLog);

      // Keep only last 100 errors
      if (errorLogs.length > 100) {
        errorLogs.splice(0, errorLogs.length - 100);
      }

      await chrome.storage.local.set({ error_logs: errorLogs });

    } catch (storageError) {
      console.error('[ErrorHandler] Failed to persist error:', storageError);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByCategory: Record<ErrorCategory, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: WalletError[];
  } {
    const stats = {
      totalErrors: this.errorHistory.length,
      errorsByCategory: {} as Record<ErrorCategory, number>,
      errorsBySeverity: {} as Record<ErrorSeverity, number>,
      recentErrors: this.errorHistory.slice(-10)
    };

    // Count by category and severity
    this.errorHistory.forEach(error => {
      stats.errorsByCategory[error.category] = (stats.errorsByCategory[error.category] || 0) + 1;
      stats.errorsBySeverity[error.severity] = (stats.errorsBySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
    chrome.storage.local.remove('error_logs');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Setup global error handling
   */
  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, { component: 'global', operation: 'unhandled_promise' });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, { component: 'global', operation: 'global_error' });
    });

    console.log('[ErrorHandler] Global error handling initialized');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const errorHandler = ErrorHandler.getInstance();

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY HOOK FOR REACT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export class ErrorBoundary {
  private static errorCount = 0;
  private static lastErrorTime = 0;

  static async handleComponentError(error: Error, componentName: string, additionalContext?: any): Promise<void> {
    // Prevent error spam
    const now = Date.now();
    if (now - this.lastErrorTime < 5000 && this.errorCount > 3) {
      console.warn('[ErrorBoundary] Error rate limit exceeded, suppressing error');
      return;
    }

    this.errorCount++;
    this.lastErrorTime = now;

    // Reset counter after 5 minutes
    setTimeout(() => {
      this.errorCount = 0;
    }, 5 * 60 * 1000);

    await errorHandler.handleError(error, {
      component: componentName,
      operation: 'component_error',
      ...additionalContext
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATORS FOR ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: WalletError['context']
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      await errorHandler.handleError(error, context);
      throw error; // Re-throw after handling
    }
  };
}

export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) {
  return async (...args: T): Promise<R> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  };
}