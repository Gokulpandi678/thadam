/**
 * @typedef {Object} MeetingLog
 * @property {string} [id]
 * @property {string} [type]
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [createdAt]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [primaryEmail]
 * @property {string} [secondaryEmail]
 * @property {string} [primaryContactNo]
 * @property {string} [secondaryContactNo]
 * @property {string} [company]
 * @property {string} [designation]
 * @property {string} [role]
 * @property {string} [clientType]
 * @property {string} [engagementType]
 * @property {string} [profilePicture]
 * @property {string} [addressStreet]
 * @property {string} [addressNumber]
 * @property {string} [addressCity]
 * @property {string} [addressState]
 * @property {string} [addressPostcode]
 * @property {string} [addressCountry]
 * @property {MeetingLog[]} [logs]
 */

/**
 * @typedef {Object} Client
 * @property {string} customerId
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [profilePicture]
 * @property {string} [company]
 * @property {string} [designation]
 * @property {string} [clientType]
 * @property {string} [engagementType]
 */

/**
 * @typedef {Object} FilterParams
 * @property {string} [search]
 * @property {string[]} [role]
 * @property {string[]} [designation]
 * @property {string[]} [city]
 * @property {string[]} [clientType]
 * @property {string[]} [engagementType]
 */

export {};
