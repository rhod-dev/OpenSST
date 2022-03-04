<template>
<div class="c-search-result">
    <div class="c-search_result_icon">
        <object-label
            :domain-object="result"
            :object-path="[]"
        /></div>
</div>
</template>

<script>
import ObjectLabel from '../../components/ObjectLabel.vue';

export default {
    name: 'ObjectSearchResult',
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
        resultName() {
            return this.result.name;
        }
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
};
</script>
