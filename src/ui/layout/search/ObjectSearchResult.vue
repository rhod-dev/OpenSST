<template>
<div class="c-search-result">
    <div class="c-search_result_icon">
        <object-label
            :domain-object="result"
            :object-path="result.originalPath"
        />
        <Location
            ref="location"
            :show-header="false"
            :enable-selection-listening="false"
            :is-small="true"
        />
    </div>
</div>
</template>

<script>
import ObjectLabel from '../../components/ObjectLabel.vue';
import Location from '../../inspector/Location.vue';

export default {
    name: 'ObjectSearchResult',
    components: {
        ObjectLabel,
        Location
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
    },
    mounted() {
        const selectionObject = {
            context: {
                item: this.result
            }
        };
        this.$refs.location.updateSelection([[selectionObject]]);
    }
};
</script>
