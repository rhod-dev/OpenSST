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
        :max-item="10"
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
            searchResultItems: []
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

            if (this.searchValue !== '') {
                // clear any previous search results
                this.searchResultItems = [];

                await this.getSearchResults();
            } else {
                this.searchLoading = false;
            }
        },
        async getSearchResults() {
            // an abort controller will be passed in that will be used
            // to cancel an active searches if necessary
            console.debug(`🖲 Would be searching for ${this.searchValue}`);
            this.abortSearchController = new AbortController();
            const abortSignal = this.abortSearchController.signal;
            try {
                this.searchResultItems = await this.openmct.annotation.searchForTags(this.searchValue, abortSignal);
                console.debug('results have returned', this.searchResultItems);
            } catch (error) {
                this.searchLoading = false;

                if (this.abortSearchController) {
                    delete this.abortSearchController;
                }
            }
        },
        showSearchResults() {
            console.debug(`Would be toggling search results pane`);
            this.$refs.searchResultsDropDown.showResults(this.searchResultItems);
        }
    }
};
</script>
