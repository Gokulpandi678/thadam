/**
 * AppLogger — Frontend logging utility
 *
 * Tracks: navigation (from/to), user events, API calls, errors, warnings
 * Logs to console now. Swap `_send()` for your API endpoint later.
 *
 * Usage:
 *   import logger from './logger';
 *
 *   logger.nav('/home', '/dashboard');
 *   logger.event('click', 'Button[Submit]', { value: 'ok' });
 *   logger.api('GET', '/api/users', 200, 120);
 *   logger.error(new Error('oops'), 'UserList');
 *   logger.warn('Missing prop: userId', { component: 'UserCard' });
 */

const LOG_LEVELS = {
  nav:   { label: 'NAV',   style: 'background:#185FA5;color:#fff;padding:1px 6px;border-radius:3px' },
  event: { label: 'EVENT', style: 'background:#534AB7;color:#fff;padding:1px 6px;border-radius:3px' },
  api:   { label: 'API',   style: 'background:#3B6D11;color:#fff;padding:1px 6px;border-radius:3px' },
  error: { label: 'ERROR', style: 'background:#A32D2D;color:#fff;padding:1px 6px;border-radius:3px' },
  warn:  { label: 'WARN',  style: 'background:#854F0B;color:#fff;padding:1px 6px;border-radius:3px' },
  info:  { label: 'INFO',  style: 'background:#0F6E56;color:#fff;padding:1px 6px;border-radius:3px' },
};

function _build(type, message, data = {}) {
  return {
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
    sessionId: _getSessionId(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
}

function _getSessionId() {
  if (!window.__loggerSessionId) {
    window.__loggerSessionId = 'sess_' + Math.random().toString(36).slice(2, 11);
  }
  return window.__loggerSessionId;
}

function _print(entry) {
  const { label, style } = LOG_LEVELS[entry.type] || LOG_LEVELS.info;
  const ts = new Date(entry.timestamp).toLocaleTimeString('en', { hour12: false });

  if (entry.type === 'error') {
    console.group(`%c ${label} %c ${ts} — ${entry.message}`, style, 'color:inherit');
    console.error(entry.data);
    console.groupEnd();
  } else if (entry.type === 'warn') {
    console.group(`%c ${label} %c ${ts} — ${entry.message}`, style, 'color:inherit');
    console.warn(entry.data);
    console.groupEnd();
  } else {
    console.group(`%c ${label} %c ${ts} — ${entry.message}`, style, 'color:inherit');
    console.log(entry.data);
    console.groupEnd();
  }
}

/**
 * Swap this out to POST to your real endpoint later.
 *   async function _send(entry) {
 *     await fetch('/api/logs', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(entry),
 *     });
 *   }
 */
function _send(entry) {
  // TODO: replace with API call
  _print(entry);
}

const logger = {
  /**
   * Log a route change.
   * @param {string} from  - Previous path, e.g. '/home'
   * @param {string} to    - Next path, e.g. '/dashboard'
   * @param {object} [params] - Route params or query string data
   */
  nav(from, to, params = {}) {
    _send(_build('nav', `${from} → ${to}`, { from, to, params }));
  },

  /**
   * Log a user interaction event.
   * @param {string} eventType  - 'click' | 'change' | 'submit' | 'focus' | 'blur' | etc.
   * @param {string} target     - Readable target name, e.g. 'Button[Submit]'
   * @param {object} [extra]    - Additional context (value, element path, etc.)
   */
  event(eventType, target, extra = {}) {
    _send(_build('event', `${eventType}:${target}`, { eventType, target, ...extra }));
  },

  /**
   * Log an API call result.
   * @param {string} method     - HTTP method, e.g. 'GET'
   * @param {string} url        - Endpoint path, e.g. '/api/users'
   * @param {number} status     - HTTP status code
   * @param {number} duration   - Response time in ms
   * @param {object} [extra]    - Request/response body, headers, etc.
   */
  api(method, url, status, duration, extra = {}) {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'api';
    _send(_build(level, `${method} ${url} ${status} ${duration}ms`, {
      method, url, status, duration, ...extra
    }));
  },

  /**
   * Log an error.
   * @param {Error|string} err        - Error object or message string
   * @param {string} [componentName]  - React component where error occurred
   * @param {object} [extra]          - Extra context
   */
  error(err, componentName = '', extra = {}) {
    const message = err instanceof Error ? err.message : String(err);
    _send(_build('error', message, {
      stack: err instanceof Error ? err.stack : undefined,
      component: componentName,
      ...extra,
    }));
  },

  /**
   * Log a warning.
   * @param {string} message
   * @param {object} [data]
   */
  warn(message, data = {}) {
    _send(_build('warn', message, data));
  },

  /**
   * Log a generic info message.
   * @param {string} message
   * @param {object} [data]
   */
  info(message, data = {}) {
    _send(_build('info', message, data));
  },
};

export default logger;