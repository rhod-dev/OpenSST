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
<div class="c-tag_editor">

    <TagSelection
        v-for="(addedTag, index) in addedTags"
        :key="index"
        :annotation="annotation"
        :selected-tag="addedTag"
        :new-tag="addedTag.newTag"
        :entry="entry"
        @tagRemoved="tagRemoved"
        @tagAdded="tagAdded"
    />
    <button
        class="c-add-tag-button c-icon-button c-icon-button--major icon-plus"
        title="Add new tag"
        @click="addTag"
    >
    </button> <div class="c-add-tag-text"> Add Tag </div>

</div>
</template>

<script>
import TagSelection from './TagSelection.vue';

export default {
    components: {
        TagSelection
    },
    inject: ['openmct'],
    props: {
        annotation: {
            type: Object,
            default() {
                return null;
            }
        },
        entry: {
            type: Object,
            default() {
                return null;
            }
        },
        domainObject: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    data() {
        return {
            addedTags: []
        };
    },
    computed: {
        availableTags() {
            return this.openmct.annotation.getAvailableTags();
        }
    },
    watch: {
        annotation: {
            handler() {
                this.tagsChanged(this.annotation.tags);
            },
            deep: true
        }
    },
    mounted() {
        this.addAnnotationListener(this.annotation);
        if (this.annotation && this.annotation.tags) {
            this.tagsChanged(this.annotation.tags);
        }
    },
    destroyed() {
        if (this.removeTagsListener) {
            this.removeTagsListener();
        }
    },
    methods: {
        addAnnotationListener(annotation) {
            if (annotation && !this.removeTagsListener) {
                this.removeTagsListener = this.openmct.objects.observe(annotation, 'tags', this.tagsChanged);
            }
        },
        tagsChanged(newTags) {
            if (newTags.length < this.addedTags.length) {
                this.addedTags = this.addedTags.slice(0, newTags.length);
            }

            for (let index = 0; index < newTags.length; index += 1) {
                this.$set(this.addedTags, index, newTags[index]);
            }
        },
        addTag() {
            const newTagValue = {
                newTag: true
            };
            this.addedTags.push(newTagValue);
        },
        async tagRemoved({entry, tag}) {
            console.debug(`removing tag ${tag}`);
            await this.openmct.annotation.removeNotebookAnnotationTag(entry.id, this.domainObject, tag, '');
        },
        async tagAdded({entry, newTag}) {
            const newAnnotation = await this.openmct.annotation.addNotebookAnnotationTag(this.entry.id, this.domainObject, newTagValue);
            if (!this.annotation) {
                this.addAnnotationListener(newAnnotation);
            }

            this.tagsChanged(newAnnotation.tags);
            await this.openmct.annotation.changeNotebookAnnotationTag(entry.id, this.domainObject, oldTag, newTag, '');
        }
    }
};
</script>
