<template>
<div
    v-if="annotationResults || objectResults"
    class="c-search_dropdown"
>

    <div
        v-show="resultsShown"
        class="c-search_dropdown_content"
    >
        <div
            v-if="annotationResults"
            ref="tagResults"
        >
            <h4 class="c-search_results_title"> TAGGED </h4>
            <annotation-search-result
                v-for="(annotationResult, index) in annotationResults"
                :key="index"
                :result="annotationResult"
                @mousedown="selectResult(annotationResult)"
            />
        </div>
        <div
            v-if="objectResults"
            ref="objectResults"
        >
            <h4 class="c-search_results_title"> OBJECTS </h4>
            <object-search-result
                v-for="(objectResult, index) in objectResults"
                :key="index"
                :result="objectResult"
                @mousedown="selectResult(objectResult)"
            />
        </div>
    </div>
</div>
</template>

<script>
import AnnotationSearchResult from './AnnotationSearchResult.vue';
import ObjectSearchResult from './ObjectSearchResult.vue';

export default {
    name: 'SearchResultsDropDown',
    components: {
        AnnotationSearchResult,
        ObjectSearchResult
    },
    props: {
    },
    data() {
        return {
            selectedResult: {},
            resultsShown: false,
            annotationResults: [],
            objectResults: []
        };
    },
    computed: {
    },
    watch: {
    },
    created() {
        this.$emit('selected', this.selected);
    },
    methods: {
        selectResult(result) {
            console.debug(`result to be displayed 🍇`, result);
            this.selectedResult = result;
            this.resultsShown = false;
            this.$emit('selected', this.selectedResult);
        },
        showResults(passedAnnotationResults, passedObjectResults) {
            this.resultsShown = passedAnnotationResults.length || passedObjectResults.length;
            this.annotationResults = passedAnnotationResults;
            this.objectResults = passedObjectResults;
        }
    },
    template: 'Dropdown'
};
</script>
