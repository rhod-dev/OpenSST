<template>
<div
    v-if="(annotationResults && annotationResults.length) ||
        (objectResults && objectResults.length)"
    class="c-search_dropdown"
>

    <div
        v-show="resultsShown"
        class="c-search_dropdown_content"
    >
        <div
            v-if="objectResults && objectResults.length"
            ref="objectResults"
        >
            <h4 class="c-search_results_title"> OBJECTS </h4>
            <object-search-result
                v-for="(objectResult, index) in objectResults"
                :key="index"
                :result="objectResult"
                @click.native="selectResult(objectResult)"
            />
        </div>
        <div
            v-if="annotationResults && annotationResults.length"
            ref="annotationResults"
        >
            <h4 class="c-search_results_title"> TAGGED </h4>
            <annotation-search-result
                v-for="(annotationResult, index) in annotationResults"
                :key="index"
                :result="annotationResult"
                @click.native="selectResult(annotationResult)"
            />
        </div>
    </div>
</div>
</template>

<script>
import AnnotationSearchResult from './AnnotationSearchResult.vue';
import ObjectSearchResult from './ObjectSearchResult.vue';
import objectPathToUrl from '../../../tools/url';

export default {
    name: 'SearchResultsDropDown',
    components: {
        AnnotationSearchResult,
        ObjectSearchResult
    },
    inject: ['openmct'],
    data() {
        return {
            resultsShown: false,
            annotationResults: [],
            objectResults: []
        };
    },
    methods: {
        selectResult(result) {
            console.debug(`result to be displayed 🍇`, result);
            this.resultsShown = false;
            const objectPath = result.originalPath;
            const resultUrl = objectPathToUrl(this.openmct, objectPath);
            this.openmct.router.navigate(resultUrl);
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
