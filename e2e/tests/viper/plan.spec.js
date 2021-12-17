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

/* Tests for plan edit functionality */

const { test, expect } = require('@playwright/test');

test('Verify that a created Folder can be exported and imported again', async ({ page }) => {

    //Go to baseURL
    await page.goto('/', { waitUntil: 'networkidle' });

    //Click the Create button
    await page.click('button:has-text("Create")');

    // Click text=Plan
    await page.click('text=Plan');

    // Click text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]
    await page.click('text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]');

    // Click form[name="mctForm"] >> text=Title
    await page.click('form[name="mctForm"] >> text=Title');

    // Triple click text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]
    await page.click('text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]', {
        clickCount: 3
    });

    // Fill text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]
    await page.fill('text=Properties Title Notes Upload Plan (JSON File) Select File... >> input[type="text"]', 'NamedPlan');

    // Click text=Select File...
    await page.click('text=Select File...');

    // Upload activities_new.json
    await page.setInputFiles('text=Select File...', 'activities_new.json');

    // Click text=OK
    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://localhost:8080/#/browse/mine/a4590e2c-7ff6-48f6-93bd-b87385af6719?tc.mode=fixed&tc.startBound=1639600259998&tc.endBound=1639602059998&tc.timeSystem=utc&view=plan.view' }*/),
        page.click('text=OK')
    ]);

    // Click text=Start End >> a
    await page.click('text=Start End >> a');

    // 7× click
    await page.click('.c-pager__next', {
        clickCount: 7
    });

    // Click .c-pager__prev
    await page.click('.c-pager__prev');

    // Click .c-pager__prev
    await page.click('.c-pager__prev');

    // Click .c-pager__prev
    await page.click('.c-pager__prev');

    // Click text=21 355 >> div
    await page.click('text=21 355 >> div');

    // Click text=Start End >> :nth-match(a, 2)
    await page.click('text=Start End >> :nth-match(a, 2)');

    // 9× click
    await page.click('.c-pager__next', {
        clickCount: 9
    });

    // Double click .c-pager__prev
    await page.dblclick('.c-pager__prev');

    // Double click .c-pager__prev
    await page.dblclick('.c-pager__prev');

    // Click text=1 183
    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://localhost:8080/#/browse/mine/a4590e2c-7ff6-48f6-93bd-b87385af6719?tc.mode=fixed&tc.startBound=1703190659000&tc.endBound=1719867659000&tc.timeSystem=utc&view=plan.view' }*/),
        page.click('text=1 183')
    ]);

    // Click text=Prospecting Rails Driving Prospecting Rails Driving Rails Driving Prospecting Ra
    await page.click('text=Prospecting Rails Driving Prospecting Rails Driving Rails Driving Prospecting Ra');

});
