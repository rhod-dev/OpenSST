<template>
<div
    v-if="(annotationResults && annotationResults.length) ||
        (objectResults && objectResults.length)"
    class="c-gsearch__dropdown"
>
    <div
        v-show="resultsShown"
        class="c-gsearch__dropdown_content"
    >
        <div class= "c-gsearch__filter"> 
            <button> All <sup> 200+ </sup> </button>
            <button> Telemetry <sup> 2 </sup> </button>
            <button> Imagery <sup>4</sup> </button>
            <button> Map <sup> 31 </sup> </button>
            <button> Notebook <sup> 145 </sup> </button>
            <button> Objects <sup>6</sup> </button>
        </div>
        <div class="c-gsearch__results-section" 
            v-if="objectResults && objectResults.length"
            ref="objectResults"
        >
            <h4 class="c-gsearch__results_title"> OBJECTS </h4>
            <object-search-result
                v-for="(objectResult, index) in objectResults"
                :key="index"
                :result="objectResult"
                @click.native="selectedResult"
            />
        </div>
        <div
            v-if="annotationResults && annotationResults.length"
            ref="annotationResults"
        >
            <h4 class="c-gsearch__results_title"> TAGGED </h4>
            <annotation-search-result
                v-for="(annotationResult, index) in annotationResults"
                :key="index"
                :result="annotationResult"
                @click.native="selectedResult"
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
    data() {
        return {
            resultsShown: false,
            annotationResults: [],
            objectResults: []
        };
    },
    methods: {
        selectedResult() {
            console.debug(`selected a result, need to hide search dropdown`);
            this.resultsShown = false;
        },
        showResults(passedAnnotationResults, passedObjectResults) {
            if ((passedAnnotationResults && passedAnnotationResults.length)
                || (passedObjectResults && passedObjectResults.length)) {
                this.resultsShown = true;
                this.annotationResults = passedAnnotationResults;
                this.objectResults = passedObjectResults;
            } else {
                this.resultsShown = false;
            }
        }
    },
    template: 'Dropdown'
};
</script>
