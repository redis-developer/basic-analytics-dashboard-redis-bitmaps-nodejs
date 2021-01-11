<template>
    <v-select v-model="period" :items="values" item-text="text" item-value="value" label="Time Period" />
</template>

<script>
export default {
    data() {
        return {
            period: null,
            values: [
                { text: '1st week of December', value: 'dec_week_1' },
                { text: '2nd week of December', value: 'dec_week_2' },
                { text: '3rd week of December', value: 'dec_week_3' },
                { text: '4th week of December', value: 'dec_week_4' },
                { text: '5th week of December', value: 'dec_week_5' },
                { text: 'December', value: null }
            ]
        };
    },

    watch: {
        period() {
            this.$emit('onSelect', this.period);
        }
    },

    created() {
        this.$emit('onSelect', this.period);
    }
};
</script>
