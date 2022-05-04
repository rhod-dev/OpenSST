<template>
<div
    class="c-gsearch-result c-gsearch-result--annotation"
    @click="clickedResult"
>
    <div class="c-gsearch-result__icon">
        <object-label
            :domain-object="result"
            :object-path="result.originalPath"
        />
    </div>
    <div class="c-gsearch-result__body">
        <div
            class="c-gsearch-result__title"
            @click="clickedResult"
        >
            {{ result.name }}
        </div>

        <Location
            ref="location"
            :show-header="false"
            :enable-selection-listening="false"
            :is-small="true"
        />

        <div
            class="c-tag"
            :style="{backgroundColor: tagBackgroundColor, color: tagForegroundColor}"
        >
            {{ resultTagLabel }}
        </div>
    </div>
    <div class="c-gsearch-result__more-options-button">
        <button class="c-icon-button icon-3-dots"></button>
    </div>
</div>
</template>

<script>
import ObjectLabel from '../../components/ObjectLabel.vue';
import Location from '../../inspector/Location.vue';
import objectPathToUrl from '../../../tools/url';

export default {
    name: 'AnnotationSearchResult',
    components: {
        ObjectLabel,
        Location
    },
    inject: ['openmct'],
    props: {
        result: {
            type: Object,
            required: true,
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
        domainObject() {
            return this.result.targetModels[0];
        },
        resultTagLabel() {
            return this.result.fullTagModels[0].label.toUpperCase();
        },
        getResultName() {
            if (this.result.annotationType === this.openmct.annotation.ANNOTATION_TYPES.NOTEBOOK) {
                const targetID = Object.keys(this.result.targets)[0];
                const entryIdToFind = this.result.targets[targetID].entryId;
                const notebookModel = this.result.targetModels[0].configuration.entries;

                const sections = Object.values(notebookModel);
                for (const section of sections) {
                    const pages = Object.values(section);
                    for (const entries of pages) {
                        for (const entry of entries) {
                            if (entry.id === entryIdToFind) {
                                return entry.text;
                            }
                        }
                    }
                }

                return "Could not find notebook entry";
            } else {
                return this.result.targetModels[0].name;
            }
        },
        tagBackgroundColor() {
            return this.result.fullTagModels[0].backgroundColor;
        },
        tagForegroundColor() {
            return this.result.fullTagModels[0].foregroundColor;
        }
    },
    mounted() {
        const selectionObject = {
            context: {
                item: this.domainObject
            }
        };
        this.$refs.location.updateSelection([[selectionObject]]);
    },
    methods: {
        clickedResult() {
            const objectPath = this.domainObject.originalPath;
            const resultUrl = objectPathToUrl(this.openmct, objectPath);
            this.openmct.router.navigate(resultUrl);
        }
    }
};
</script>
