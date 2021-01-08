<template>
    <v-select v-model="periodId" :items="values" item-text="text" item-value="value" label="Time Period" />
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            periodId: 0,
            values: [
                { text: '1st week of December', value: 0 },
                { text: '2nd week of December', value: 1 },
                { text: '3rd week of December', value: 2 },
                { text: '4th week of December', value: 3 },
                { text: '5th week of December', value: 4 }
            ]
        };
    },

    watch: {
        periodId() {
            this.fetchTrafficByTime();
        }
    },

    created() {
        this.fetchTrafficByTime();
    },

    methods: {
        ...mapActions({ fetchTrafficEntriesByTime: 'traffic/fetchEtriesByTime' }),

        async fetchTrafficByTime() {
            const periods = [
                {
                    from: '2015-12-01',
                    to: '2015-12-07'
                },
                {
                    from: '2015-12-08',
                    to: '2015-12-14'
                },
                {
                    from: '2015-12-15',
                    to: '2015-12-21'
                },
                {
                    from: '2015-12-22',
                    to: '2015-12-28'
                },
                {
                    from: '2015-12-29',
                    to: '2015-12-31'
                }
            ];

            let between = periods[this.periodId];

            await this.fetchTrafficEntriesByTime(between);
        }
    }
};
</script>
