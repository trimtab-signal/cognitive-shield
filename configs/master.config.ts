// MASTER_PROJECT Configuration System
// Unified configuration for all integrated components

export interface MasterConfig {
  // Core Architecture
  project: {
    name: string;
    version: string;
    architecture: 'delta-topology';
    foundingNodes: string[];
  };

  // Component Configurations
  frontend: {
    cognitiveShield: {
      ollama: {
        baseUrl: string;
        model: string;
        timeout: number;
      };
      haptic: {
        enabled: boolean;
        patterns: Record<string, number[]>;
      };
      theme: {
        typography: {
          display: string;
          body: string;
        };
        colors: {
          primary: string;
          accent: string;
          text: {
            primary: string;
            secondary: string;
            accent: string;
          };
        };
      };
    };
  };

  economics: {
    wallet: {
      encryption: {
        algorithm: string;
        keyDerivation: string;
      };
      stealth: {
        enabled: boolean;
        prefix: string;
      };
      networks: string[];
    };
  };

  ledger: {
    love: {
      consensus: 'proof-of-care';
      economics: 'dynamic-equity';
      legal: 'perpetual-purpose-trust';
    };
  };

  firmware: {
    esp32: {
      protocol: 'pqc-hybrid';
      mesh: 'reliculum';
      hardwareRootOfTrust: boolean;
    };
  };

  legal: {
    adamsChallenge: {
      enabled: boolean;
      court: string;
      jurisdiction: string;
    };
    permaweb: {
      arweave: {
        gateway: string;
        bundlr: string;
      };
    };
  };

  communication: {
    vpi: {
      enabled: boolean;
      dialects: Record<string, string>;
      impedanceMatching: boolean;
    };
  };
}

export const MASTER_CONFIG: MasterConfig = {
  project: {
    name: 'MASTER_PROJECT',
    version: '1.0.0',
    architecture: 'delta-topology',
    foundingNodes: ['cognitive-shield', 'donation-wallet', 'love-protocol', 'firmware']
  },

  frontend: {
    cognitiveShield: {
      ollama: {
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        timeout: 30000
      },
      haptic: {
        enabled: true,
        patterns: {
          success: [100, 50, 100],
          error: [200, 50, 200, 50, 200],
          alert: [50, 100, 50, 100, 50]
        }
      },
      theme: {
        typography: {
          display: '"Space Grotesk", "Courier New", monospace',
          body: '"Inter", system-ui, sans-serif'
        },
        colors: {
          primary: '#1e40af',
          accent: '#f59e0b',
          text: {
            primary: '#ffffff',
            secondary: '#9ca3af',
            accent: '#60a5fa'
          }
        }
      }
    }
  },

  economics: {
    wallet: {
      encryption: {
        algorithm: 'aes-256-gcm',
        keyDerivation: 'scrypt'
      },
      stealth: {
        enabled: true,
        prefix: 'st:eth:0x'
      },
      networks: ['ethereum', 'polygon', 'arbitrum']
    }
  },

  ledger: {
    love: {
      consensus: 'proof-of-care',
      economics: 'dynamic-equity',
      legal: 'perpetual-purpose-trust'
    }
  },

  firmware: {
    esp32: {
      protocol: 'pqc-hybrid',
      mesh: 'reliculum',
      hardwareRootOfTrust: true
    }
  },

  legal: {
    adamsChallenge: {
      enabled: true,
      court: 'superior-court-georgia',
      jurisdiction: 'fulton-county'
    },
    permaweb: {
      arweave: {
        gateway: 'https://arweave.net',
        bundlr: 'https://node2.bundlr.network'
      }
    }
  },

  communication: {
    vpi: {
      enabled: true,
      dialects: {
        astrology: 'aquarius-age',
        cosmetology: 'bond-building',
        engineering: 'impedance-matching'
      },
      impedanceMatching: true
    }
  }
};

export default MASTER_CONFIG;