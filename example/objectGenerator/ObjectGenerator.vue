<!--
 Open MCT, Copyright (c) 2014-2022, United States Government
 as represented by the Administrator of the National Aeronautics and Space
 Administration. All rights reserved.

 Open MCT is licensed under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.

 Open MCT includes source code licensed under additional open source
 licenses. See the Open Source Licenses file (LICENSES.md) included with
 this source code distribution or the Licensing information page available
 at runtime from the About dialog for additional information.
-->

<template>
<div class="l-angular-ov-wrapper">
    <div class="u-contents">
        <div class="u-style-receiver js-style-receiver">
            <button class="c-button icon-reset"
                    title="Generate Objcts"
                    @click="generateObjects(5, 100, 100)"
            >
                <span class="c-button__label">Generate Objects</span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
import uuid from 'uuid';
import nouns from './nouns-list.json';
import adjectives from './adjectives-list.json';

export default {
    inject: ['openmct', 'domainObject'],
    data() {
        return {
        };
    },
    computed: {
        configuration() {
            return this.domainObject.configuration;
        }
    },
    mounted() {
        this.annotationTypes = ['geospatial', 'temporal', 'pixel-spatial'];
    },
    methods: {
        async generateObjects(targetsPerSet, annotationsPerSet, setsOfTargets) {
            console.debug('Generating objects');
            const parentObject = await this.openmct.objects.get(this.domainObject.location);
            const promiseArray = [];
            for (let targetIndex = 0; targetIndex < setsOfTargets; targetIndex += 1) {
                const targetList = this.generateTargets(targetsPerSet);
                for (let annotationIndex = 0; annotationIndex < annotationsPerSet; annotationIndex += 1) {
                    promiseArray.push(new Promise(resolve => {
                        resolve(this.generateObject('annotation', targetList, parentObject, annotationIndex));
                    }));
                }
            }

            this.throttlePromises(promiseArray);
            console.log(`Promise array size is ${promiseArray.length}`);
        },
        generateTargets(numberOfTargets) {
            const targets = [];
            for (let i = 0; i < numberOfTargets; i += 1) {
                targets.push(`${this.domainObject.identifier.namespace}:${uuid()}`);
            }

            return targets;
        },
        async throttlePromises(promiseArray) {
            const MAX_IN_PROCESS = 100;
            const results = new Array(promiseArray.length);

            async function doBlock(startIndex) {
                // Shallow-copy a block of promises to work on
                const currBlock = promiseArray.slice(startIndex, startIndex + MAX_IN_PROCESS);
                // Await the completion. If any fail, it will throw and that's good.
                const blockResults = await Promise.all(currBlock);
                // Assuming all succeeded, copy the results into the results array
                for (let ix = 0; ix < blockResults.length; ix++) {
                    results[ix + startIndex] = blockResults[ix];
                }
            }

            for (let iBlock = 0; iBlock < promiseArray.length; iBlock += MAX_IN_PROCESS) {
                await doBlock(iBlock);
            }

            return results;
        },
        getRandomNoun() {
            return this.getRandomElement(nouns);
        },
        getRandomAdjective() {
            return this.getRandomElement(adjectives);
        },
        getRandomAnnotationType() {
            return this.getRandomElement(this.annotationTypes);
        },
        getRandomElement(list) {
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomInteger(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        async generateObject(type, targetList, parentObject, iteration) {
            const typeDefinition = this.openmct.types.get(type);
            const definition = typeDefinition.definition;
            const createdObject = {
                name: `${this.getRandomAdjective()} ${this.getRandomNoun()} ${iteration} ${definition.name}`,
                type,
                identifier: {
                    key: uuid(),
                    namespace: parentObject.identifier.namespace
                }
            };
            if (definition.initialize) {
                definition.initialize(createdObject);
            }

            createdObject.tags = [this.getRandomAdjective(), this.getRandomAdjective(), this.getRandomAdjective()];
            createdObject.annotationType = this.getRandomAnnotationType();
            const start = this.getRandomInteger(1, 8000);
            const end = this.getRandomInteger(start, 8000);
            const targetID = this.getRandomElement(targetList);
            createdObject.targets[targetID] = {
                targetTime: {
                    start,
                    end
                }
            };

            createdObject.contentText = `${this.getRandomAdjective()} ${this.getRandomAdjective()} ${this.getRandomNoun()}`;
            createdObject.modified = Date.now();
            createdObject.originalContextPath = '/mine/8e488d26-5fc2-4b30-9947-8e9eba3bda20';
            createdObject.location = this.domainObject.location;
            const success = await this.openmct.objects.save(createdObject);
            if (success) {
                console.debug(`Save successful of ${createdObject.name}`);
                const compositionCollection = await this.openmct.composition.get(parentObject);
                compositionCollection.add(createdObject);
            } else {
                console.error('Error saving objects');
            }
        }
    }
};
</script>
