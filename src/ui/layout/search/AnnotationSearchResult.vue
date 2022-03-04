<template>
<div class="c-search-result">
    <div class="c-tag-in-search-result"
         :style="{backgroundColor: tagBackgroundColor, color: tagForegroundColor}"
    >
        {{ resultTagLabel }}
    </div>
    <div class="c-search_result_content">
        <div class="c-search_result_label">
            <object-label
                :domain-object="domainObject"
                :object-path="[]"
            />
        </div>
        <div class="c-search_result_content">
            {{ resultNotebookName }}
        </div>
    </div>
</div>
</template>

<script>
import ObjectLabel from '../../components/ObjectLabel.vue';
export default {
    name: 'AnnotationSearchResult',
    components: {
        ObjectLabel
    },
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
        resultNotebookName() {
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
        },
        tagBackgroundColor() {
            return this.result.fullTagModels[0].backgroundColor;
        },
        tagForegroundColor() {
            return this.result.fullTagModels[0].foregroundColor;
        }
    },
    watch: {
    },
    created() {
    },
    methods: {
        getEntryTextFromNotebook(entryIdToFind, notebookModel) {

        }
    },
    methods: {
    }
};
</script>
