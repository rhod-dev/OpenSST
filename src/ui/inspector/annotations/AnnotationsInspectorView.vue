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
<div class="c-inspector__properties c-inspect-properties">
    <div class="c-inspect-properties__header">
        Annotations
    </div>
    <ul
        v-if="hasAnnotations"
        class="c-inspect-properties__section"
    >
    </ul>
    <div
        v-else
        class="c-inspect-properties__row--span-all"
    >
        {{ noAnnotationsMessage }}
    </div>
</div>
</template>

<script>

export default {
    inject: ['openmct'],
    data() {
        return {
            selection: null,
            annotations: null
        };
    },
    computed: {
        hasAnnotations() {
            return Boolean(
                this.annotations
                && this.annotations.length
                && !this.multiSelection
            );
        },
        multiSelection() {
            return this.selection && this.selection.length > 1;
        },
        noAnnotationsMessage() {
            return this.multiSelection
                ? 'No annotations to display for multiple items'
                : 'No annotations to display for this item';
        }
    },
    mounted() {
        this.openmct.selection.on('change', this.updateSelection);
        this.updateSelection(this.openmct.selection.get());
    },
    beforeDestroy() {
        this.openmct.selection.off('change', this.updateSelection);
    },
    methods: {
        updateSelection(selection) {
            this.selection = selection;
        }
    }
};
</script>
