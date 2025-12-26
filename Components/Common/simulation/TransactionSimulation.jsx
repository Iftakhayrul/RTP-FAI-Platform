// Transaction simulator utilities for generating realistic fraud/legitimate transactions

const merchants = [
  { name: 'Amazon', category: 'E-commerce', risk: 0.1 },
  { name: 'Walmart', category: 'Retail', risk: 0.05 },
  { name: 'Shell Gas', category: 'Gas Station', risk: 0.15 },
  { name: 'Netflix', category: 'Subscription', risk: 0.02 },
  { name: 'CryptoExchange', category: 'Cryptocurrency', risk: 0.7 },
  { name: 'CasinoRoyale', category: 'Gambling', risk: 0.6 },
  { name: 'WireTransferCo', category: 'Money Transfer', risk: 0.5 },
  { name: 'Apple Store', category: 'Electronics', risk: 0.2 },
  { name: 'BestBuy', category: 'Electronics', risk: 0.15 },
  { name: 'Starbucks', category: 'Food & Beverage', risk: 0.02 },
  { name: 'Unknown Merchant', category: 'Unknown', risk: 0.8 },
  { name: 'FastCash ATM', category: 'ATM', risk: 0.4 },
];

const countries = [
  { code: 'US', name: 'United States', risk: 0.1 },
  { code: 'UK', name: 'United Kingdom', risk: 0.1 },
  { code: 'NG', name: 'Nigeria', risk: 0.6 },
  { code: 'RU', name: 'Russia', risk: 0.5 },
  { code: 'CN', name: 'China', risk: 0.3 },
  { code: 'BR', name: 'Brazil', risk: 0.3 },
  { code: 'DE', name: 'Germany', risk: 0.1 },
  { code: 'JP', name: 'Japan', risk: 0.1 },
];

const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'WA', 'MA', 'CO', 'GA', 'AZ'];
const channels = ['Card', 'ACH', 'Wire', 'Instant'];

const reasonCodeMap = {
  high_velocity: 'High transaction velocity (>5 tx in 10 min)',
  new_device: 'Transaction from new/unknown device',
  geo_anomaly: 'Geographic distance anomaly detected',
  high_amount: 'Amount exceeds normal spending pattern',
  merchant_risk: 'High-risk merchant category',
  time_anomaly: 'Unusual transaction time',
  channel_risk: 'High-risk channel for amount',
  pattern_break: 'Deviation from historical pattern',
};

function generateTxId() {
  return 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateCustomerId() {
  return 'CUST-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function generateDeviceId() {
  return 'DEV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAmount(isFraud) {
  if (isFraud) {
    // Fraudulent transactions tend to be higher or very specific amounts
    const patterns = [
      () => Math.floor(Math.random() * 5000) + 500, // High amounts
      () => Math.floor(Math.random() * 100) + 1, // Micro amounts (testing)
      () => 999.99, // Just under reporting threshold
      () => Math.floor(Math.random() * 10000) + 2000, // Very high
    ];
    return Number(randomFromArray(patterns)().toFixed(2));
  }
  // Normal distribution of amounts
  return Number((Math.random() * 500 + 10).toFixed(2));
}

function calculateRiskScore(tx, isFraud) {
  let score = 0;
  const reasons = [];

  // Base fraud injection
  if (isFraud) score += 40;

  // Amount risk
  if (tx.amount > 1000) {
    score += 15;
    reasons.push('high_amount');
  }

  // Merchant risk
  if (tx.merchant_risk > 0.4) {
    score += tx.merchant_risk * 30;
    reasons.push('merchant_risk');
  }

  // Velocity (simulated)
  if (tx.velocity_10min > 5) {
    score += 20;
    reasons.push('high_velocity');
  }

  // Device change
  if (tx.device_change_flag) {
    score += 15;
    reasons.push('new_device');
  }

  // Geo distance
  if (tx.geo_distance_km > 500) {
    score += 12;
    reasons.push('geo_anomaly');
  }

  // Time of day (late night = higher risk)
  const hour = new Date(tx.timestamp).getHours();
  if (hour >= 1 && hour <= 5) {
    score += 8;
    reasons.push('time_anomaly');
  }

  // Channel risk for high amounts
  if ((tx.channel === 'Wire' || tx.channel === 'Instant') && tx.amount > 500) {
    score += 10;
    reasons.push('channel_risk');
  }

  // Cap at 100
  score = Math.min(100, Math.max(0, Math.round(score)));

  return { score, reasons };
}

function getDecision(riskScore) {
  if (riskScore >= 70) return 'Decline';
  if (riskScore >= 40) return 'Challenge';
  return 'Approve';
}

export function generateTransaction(attackMode = false) {
  const isFraud = attackMode ? Math.random() < 0.6 : Math.random() < 0.05;
  const merchant = randomFromArray(merchants);
  const country = isFraud 
    ? randomFromArray(countries.filter(c => c.risk > 0.3)) 
    : randomFromArray(countries.filter(c => c.risk <= 0.3));
  
  const tx = {
    tx_id: generateTxId(),
    timestamp: new Date().toISOString(),
    amount: generateAmount(isFraud),
    merchant: merchant.name,
    merchant_category: merchant.category,
    channel: randomFromArray(channels),
    country: country.code,
    state: country.code === 'US' ? randomFromArray(states) : null,
    customer_id: generateCustomerId(),
    device_id: generateDeviceId(),
    velocity_10min: isFraud ? Math.floor(Math.random() * 10) + 3 : Math.floor(Math.random() * 3),
    avg_amount_30d: Number((Math.random() * 300 + 50).toFixed(2)),
    device_change_flag: isFraud ? Math.random() < 0.7 : Math.random() < 0.1,
    geo_distance_km: isFraud ? Math.floor(Math.random() * 2000) + 100 : Math.floor(Math.random() * 100),
    merchant_risk: merchant.risk,
    is_fraud: isFraud,
  };

  const { score, reasons } = calculateRiskScore(tx, isFraud);
  tx.risk_score = score;
  tx.decision = getDecision(score);
  tx.reason_codes = reasons.map(r => reasonCodeMap[r]);

  return tx;
}

export function generateBatch(count, attackMode = false) {
  return Array.from({ length: count }, () => generateTransaction(attackMode));
}

// AML Network generation utilities
const accountPool = Array.from({ length: 50 }, (_, i) => `ACC-${(i + 1).toString().padStart(4, '0')}`);

export function generateAMLTransfer(isSuspicious = false) {
  const fromIdx = Math.floor(Math.random() * accountPool.length);
  let toIdx = Math.floor(Math.random() * accountPool.length);
  while (toIdx === fromIdx) {
    toIdx = Math.floor(Math.random() * accountPool.length);
  }

  return {
    from_account: accountPool[fromIdx],
    to_account: accountPool[toIdx],
    amount: isSuspicious 
      ? Number((Math.random() * 50000 + 5000).toFixed(2))
      : Number((Math.random() * 2000 + 100).toFixed(2)),
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function generateMuleCluster(typology) {
  const clusterId = 'CLU-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const hubAccount = accountPool[Math.floor(Math.random() * 10)];
  const transfers = [];
  
  switch (typology) {
    case 'Fan-out':
      // One source disperses to many
      for (let i = 0; i < 8; i++) {
        transfers.push({
          from_account: hubAccount,
          to_account: accountPool[10 + i],
          amount: Number((Math.random() * 10000 + 2000).toFixed(2)),
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      break;
    case 'Fan-in':
      // Many sources funnel to one
      for (let i = 0; i < 8; i++) {
        transfers.push({
          from_account: accountPool[10 + i],
          to_account: hubAccount,
          amount: Number((Math.random() * 10000 + 2000).toFixed(2)),
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      break;
    case 'Cycle':
      // Circular transfers
      const cycleAccounts = accountPool.slice(20, 26);
      for (let i = 0; i < cycleAccounts.length; i++) {
        transfers.push({
          from_account: cycleAccounts[i],
          to_account: cycleAccounts[(i + 1) % cycleAccounts.length],
          amount: Number((Math.random() * 15000 + 5000).toFixed(2)),
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        });
      }
      break;
    case 'Layering':
      // Multi-hop transfers
      const layerAccounts = accountPool.slice(30, 38);
      for (let i = 0; i < layerAccounts.length - 1; i++) {
        transfers.push({
          from_account: layerAccounts[i],
          to_account: layerAccounts[i + 1],
          amount: Number((Math.random() * 20000 + 10000 - i * 1000).toFixed(2)),
          timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
        });
      }
      break;
    default:
      break;
  }

  const totalFlow = transfers.reduce((sum, t) => sum + t.amount, 0);

  return {
    cluster_id: clusterId,
    risk_score: Math.floor(Math.random() * 30) + 70,
    typology,
    account_count: new Set([...transfers.map(t => t.from_account), ...transfers.map(t => t.to_account)]).size,
    total_flow_amount: Number(totalFlow.toFixed(2)),
    hub_accounts: [hubAccount],
    fan_out_count: typology === 'Fan-out' ? transfers.length : Math.floor(Math.random() * 3),
    fan_in_count: typology === 'Fan-in' ? transfers.length : Math.floor(Math.random() * 3),
    cycle_indicator: typology === 'Cycle',
    burst_velocity: Math.floor(Math.random() * 50) + 10,
    layering_depth: typology === 'Layering' ? transfers.length : Math.floor(Math.random() * 2),
    transfers,
    status: 'Monitoring',
  };
}