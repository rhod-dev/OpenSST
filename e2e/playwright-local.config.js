/* eslint-disable no-undef */
// playwright.config.js
// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    retries: 0,
    testDir: 'tests',
    timeout: 30 * 1000,
    use: {
        browserName: "chromium",
        baseURL: 'http://localhost:8080/',
        headless: false,
        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        screenshot: 'on',
        trace: 'on',
        video: 'on'
    },
    reporter: [
        ['list'],
        ['allure-playwright']
    ]
};

module.exports = config;
