<template>
<div v-if="results"
     class="dropdown"
>

    <div v-show="resultsShown"
         class="dropdown-content"
    >
        <div
            v-for="(result, index) in results"
            :key="index"
            class="dropdown-item"
            @mousedown="selectResult(result)"
        >
            {{ result.name || result.id || '-' }}
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'SearchResultsDropDown',
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
        selectResult(option) {
            this.selectedResult = option;
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
