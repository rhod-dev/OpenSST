<template>
<div class="c-search-result">
    <div class="c-tag-in-search-result"
         :style="{backgroundColor: result.fullTagModels[0].backgroundColor, color: result.fullTagModels[0].foregroundColor}"
    >
        {{ `${result.fullTagModels[0].label}` }}
    </div>
    <div class="c-search_result_content">
        {{ `${result.targetModels[0].name}` }}
    </div>
</div>
</template>

<script>
export default {
    name: 'SearchResult',
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
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
};
</script>
