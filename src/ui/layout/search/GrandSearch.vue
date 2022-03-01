<template>
<div ref="GrandSearch">
    <search
        ref="shell-search"
        class="c-search"
        :value="searchValue"
        @click="showSearchResultsPane"
        @input="searchEverything"
        @clear="searchEverything"
    />
    <SearchResultsPane />
</div>
</template>

<script>
import search from '../../components/search.vue';
import SearchResultsPane from './SearchResultsPane.vue';

export default {
    name: 'GrandSearch',
    components: {
        search,
        SearchResultsPane

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
                this.showSearchResultsPane();
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
                const results = await this.openmct.annotation.searchForTags(this.searchValue, abortSignal);
                console.debug('results have returned', results);
            } catch (error) {
                this.searchLoading = false;

                if (this.abortSearchController) {
                    delete this.abortSearchController;
                }
            }
        },
        showSearchResultsPane() {
            console.debug(`Would be toggling search results pane`);
        }
    }
};
</script>
