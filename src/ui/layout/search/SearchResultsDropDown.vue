<template>
<div v-if="results"
     class="c-search_dropdown"
>

    <div v-show="resultsShown"
         class="c-search_dropdown_content"
    >   <div class="c-search_results_tag_title"> TAGGED </div>
        <search-result
            v-for="(result, index) in results"
            :key="index"
            :result="result"
            @mousedown="selectResult(result)"
        />
    </div>
</div>
</template>

<script>
import SearchResult from './SearchResult.vue';

export default {
    name: 'SearchResultsDropDown',
    components: {
        SearchResult
    },
    props: {
        maxItem: {
            type: Number,
            required: false,
            default: 6,
            note: 'Max items showing'
        }
    },
    data() {
        return {
            selectedResult: {},
            resultsShown: false,
            results: []
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
        showResults(passedResults) {
            this.resultsShown = passedResults.length;
            this.results = passedResults;
        }
    },
    template: 'Dropdown'
};
</script>
