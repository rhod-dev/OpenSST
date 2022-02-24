/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2022, United States Government
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

<template>
<select
    ref="tagSelection"
    v-model="tagModel"
>
    <option v-for="tag in availableTags"
            :key="tag.id"
            :value="tag.id"
    >
        {{ tag.label }}
    </option>
    <option value="remove">*Remove Tag*</option>
</select>
</template>

<script>

export default {
    inject: ['openmct'],
    props: {
        annotation: {
            type: Object,
            default() {
                return {};
            }
        },
        selectedTag: {
            type: String,
            default() {
                return "";
            }
        },
        entry: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
        };
    },
    computed: {
        availableTags() {
            return this.openmct.annotation.getAvailableTags();
        },
        tagModel: {
            get() {
                return this.selectedTag;
            },
            set(tagValue) {
                console.debug(`Set tag called with ${tagValue}`);
                if (tagValue === 'remove') {
                    console.debug(`Need to remove ${this.selectedTag}`);
                    this.$emit('tagRemoved', {
                        entry: this.entry,
                        tag: this.selectedTag
                    });
                } else {
                    this.$emit('tagAdded', {
                        entry: this.entry,
                        tag: tagValue
                    });
                }
            }
        }
    },
    mounted() {
    },
    methods: {
        addTag($event) {
            console.debug(`Would add another tag 🍊`);
        }
    }
};
</script>
