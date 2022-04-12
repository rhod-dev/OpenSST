<template>
<div ref="GrandSearch">
    <search
        ref="shell-search"
        class="c-search"
        :value="searchValue"
        @focus="showSearchResults"
        @input="searchEverything"
        @clear="searchEverything"
    />
    <SearchResultsDropDown
        ref="searchResultsDropDown"
    />

</div>
</template>

<script>
import search from '../../components/search.vue';
import SearchResultsDropDown from './SearchResultsDropDown.vue';

export default {
    name: 'GrandSearch',
    components: {
        search,
        SearchResultsDropDown
    },
    inject: ['openmct'],
    props: {
    },
    data() {
        return {
            searchValue: '',
            searchLoading: false,
            annotationSearchResults: [],
            objectSearchResults: []
        };
    },
    computed: {
    },
    methods: {
        async searchEverything(value) {
            // if an abort controller exists, regardless of the value passed in,
            // there is an active search that should be canceled
            if (this.abortSearchController) {
                this.abortSearchController.abort();
                delete this.abortSearchController;
            }

            this.searchValue = value;
            this.searchLoading = true;
            // clear any previous search results
            this.annotationSearchResults = [];
            this.objectSearchResults = [];

            if (this.searchValue) {

                await this.getSearchResults();
            } else {
                this.searchLoading = false;
                this.$refs.searchResultsDropDown.showResults(this.annotationSearchResults, this.objectSearchResults);
            }
        },
        getPathsForObjects(objectsNeedingPaths) {
            return Promise.all(objectsNeedingPaths.map(async (domainObject) => {
                const keyStringForObject = this.openmct.objects.makeKeyString(domainObject.identifier);
                const originalPathObjects = await this.openmct.objects.getOriginalPath(keyStringForObject);

                return {
                    originalPath: originalPathObjects,
                    ...domainObject
                };
            }));
        },
        async getSearchResults() {
            // an abort controller will be passed in that will be used
            // to cancel an active searches if necessary
            console.debug(`🖲 Would be searching for ${this.searchValue}`);
            this.abortSearchController = new AbortController();
            const abortSignal = this.abortSearchController.signal;
            try {
                this.annotationSearchResults = await this.openmct.annotation.searchForTags(this.searchValue, abortSignal);
                const fullObjectSearchResults = await Promise.all(this.openmct.objects.search(this.searchValue, abortSignal));
                const aggregatedObjectSearchResults = fullObjectSearchResults.flat();
                const aggregatedObjectSearchResultsWithPaths = await this.getPathsForObjects(aggregatedObjectSearchResults);
                const filterAnnotations = aggregatedObjectSearchResultsWithPaths.filter(result => {
                    return result.type !== 'annotation';
                });
                this.objectSearchResults = filterAnnotations;
                console.debug('annotation results have returned', this.annotationSearchResults);
                console.debug('object results have returned', this.objectSearchResults);
                this.showSearchResults();
            } catch (error) {
                this.searchLoading = false;

                if (this.abortSearchController) {
                    delete this.abortSearchController;
                }
            }
        },
        showSearchResults() {
            console.debug(`Would be toggling search results pane`);
            this.$refs.searchResultsDropDown.showResults(this.annotationSearchResults, this.objectSearchResults);
        }
    }
};
</script>
