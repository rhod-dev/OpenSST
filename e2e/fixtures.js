/* eslint-disable no-undef */

// This file extends the base functionality of the playwright test framework
const base = require('@playwright/test');
const { expect } = require('@playwright/test');

exports.test = base.test.extend({
    page: async ({ baseURL, page }, use) => {
        const messages = [];
        page.on('console', msg => messages.push(`[${msg.type()}] ${msg.text()}`));
        await use(page);
        await expect.soft(messages.toString()).not.toContain('[error]');
    },
    browser: async ({ playwright, browser }, use, workerInfo) => {
    // Use browserless if configured
        if (workerInfo.project.name.match(/browserless/)) {
            const vBrowser = await playwright.chromium.connectOverCDP({
                endpointURL: 'ws://localhost:3003'
            });
            await use(vBrowser);
        } else {
            // Use Local Browser for testing.
            await use(browser);
        }
    }
});

/**
 * Generic console logging function for use in tests.
 * @param {'log'|'info'|'warn'|'debug'|'error'} [severity='log'] - The severity of the message.
 * @param  {...any} args
 */
function log(severity, ...args) {
    const logTypes = ['log', 'info', 'warn', 'debug', 'error'];
    let logFn;

    // Default to log level severity if not provided
    if (!logTypes.includes(severity)) {
        args.unshift(severity);
        severity = 'log';
    }

    switch (severity) {
    case 'log':
        logFn = console.log;
        break;
    case 'info':
        logFn = console.info;
        break;
    case 'warn':
        logFn = console.warn;
        break;
    case 'debug':
        logFn = console.debug;
        break;
    case 'error':
        logFn = console.error;
        break;
    default:
        logFn = console.log;
        break;
    }

    logFn(`${severity.toUpperCase()}:`, ...args);
}

exports.log = log;
