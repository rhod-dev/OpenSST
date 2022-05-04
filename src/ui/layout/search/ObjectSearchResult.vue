<template>
<div
    class="c-gsearch-result c-gsearch-result--object"
>
    <div class="c-gsearch-result__icon">
        <object-label
            :domain-object="result"
            :object-path="result.originalPath"
        />
    </div>
    <div class="c-gsearch-result__body">
        <div
            class="c-gsearch-result__title"
            @click="clickedResult"
        >
            {{ resultName }}
        </div>

        <ObjectPath ref="objectpath" />
    </div>
    <div class="c-gsearch-result__more-options-button">
        <button class="c-icon-button icon-3-dots"></button>
    </div>
</div>
</template>

<script>
import ObjectLabel from '../../components/ObjectLabel.vue';
import ObjectPath from '../../inspector/ObjectPath.vue';
import objectPathToUrl from '../../../tools/url';

export default {
    name: 'ObjectSearchResult',
    components: {
        ObjectLabel,
        ObjectPath
    },
    inject: ['openmct'],
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
        console.log('result', this.result);
        this.$refs.objectpath.updateSelection([[selectionObject]]);
    },
    methods: {
        clickedResult() {
            const objectPath = this.result.originalPath;
            const resultUrl = objectPathToUrl(this.openmct, objectPath);
            this.openmct.router.navigate(resultUrl);
        }
    }
};
</script>
