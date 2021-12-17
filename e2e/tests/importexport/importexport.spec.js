/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

/* Tests for import/export functionality */

const { test, expect } = require('@playwright/test');
const reliablePath = 'created-folder';

test('Verify that a created Folder can be exported and imported again', async ({ page }) => {

    //Go to baseURL
    await page.goto('/', { waitUntil: 'networkidle' });

    //Click the Create button
    await page.click('button:has-text("Create Button")', 'button:has-text("Create")');

    // Verify that Create Folder appears in the dropdown
    const locator = page.locator(':nth-match(:text("Folder"), 2)');
    await expect(locator).toBeEnabled();

    // Click :nth-match(:text("Folder"), 2)
    await page.click(':nth-match(:text("Folder"), 2)');

    // Click text=Properties Title Notes >> input[type="text"]
    await page.click('text=Properties Title Notes >> input[type="text"]');

    // Fill text=Properties Title Notes >> input[type="text"]
    await page.fill('text=Properties Title Notes >> input[type="text"]', 'Created Folder222222');

    // Click text=OK
    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://localhost:8080/#/browse/mine/261c6fe7-3d65-447a-b58b-09b1cbc8286a?tc.mode=fixed&tc.startBound=1639589046692&tc.endBound=1639590846692&tc.timeSystem=utc&view=grid' }*/),
        page.click('text=OK')
    ]);

    // Click text=Grid View Snapshot >> :nth-match(button, 3)
    await page.click('text=Grid View Snapshot >> :nth-match(button, 3)');

    // Click text=Export as JSON
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('text=Export as JSON')
    ]);

    const filename = await download.path();

    // Click .c-tree__scrollable div .c-tree__item-h .c-tree__item
    await page.click('.c-tree__scrollable div .c-tree__item-h .c-tree__item', {
        button: 'right'
    });

    // Click text=Import from JSON
    await page.click('text=Import from JSON');

    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Select File...')
    ]);
    await fileChooser.setFiles(filename);

    // Click text=OK Cancel
    await page.click('text=OK Cancel');

    // Click text=OK
    await page.click('text=OK');

    //const folder_name_locator = page.locator('text=Created Folder222222', {strict: false});
    //await expect(folder_name_locator).toBeEnabled();

});
