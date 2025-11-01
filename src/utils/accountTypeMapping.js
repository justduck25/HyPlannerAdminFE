/**
 * Mapping account types from backend to display names
 * Backend sends: FREE, VIP, SUPER
 * Frontend displays: FREE, VIP, SUPER (same as backend)
 */
export const ACCOUNT_TYPE_MAPPING = {
  FREE: 'FREE',
  VIP: 'VIP', 
  SUPER: 'SUPER'
};

/**
 * Get display name for account type
 * @param {string} accountType - Backend account type (FREE, VIP, SUPER)
 * @returns {string} Display name (FREE, VIP, SUPER)
 */
export const getAccountTypeDisplayName = (accountType) => {
  return ACCOUNT_TYPE_MAPPING[accountType] || accountType;
};

/**
 * Get account type stats with display names
 * @param {Object} accountTypes - Backend account types object (FREE, VIP, SUPER)
 * @returns {Object} Account types with display names (FREE, VIP, SUPER)
 */
export const getAccountTypeStats = (accountTypes) => {
  return {
    free: {
      key: 'FREE',
      displayName: ACCOUNT_TYPE_MAPPING.FREE,
      count: accountTypes.FREE || 0
    },
    vip: {
      key: 'VIP', // Backend key
      displayName: ACCOUNT_TYPE_MAPPING.VIP, // Display as VIP
      count: accountTypes.VIP || 0
    },
    super: {
      key: 'SUPER',
      displayName: ACCOUNT_TYPE_MAPPING.SUPER,
      count: accountTypes.SUPER || 0
    }
  };
};
