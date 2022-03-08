<template>
<div class="c-search-result">
    <div class="c-search_result_icon">
        <object-label
            :domain-object="result"
            :object-path="result.originalPath"
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
    computed: {
        resultName() {
            return this.result.name;
        }
    }
};
</script>
