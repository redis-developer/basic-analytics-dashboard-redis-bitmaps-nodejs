<template>
    <base-card class="card" title="Total Traffic" :data="totalTraffic" :loading="loading">
        <base-period-select @onSelect="fetchTrafficData" />
    </base-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        baseCard: () => import('@/components/UI/BaseCard'),
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect')
    },

    data() {
        return {
            totalTraffic: 0,
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' })
    },

    watch: {
        refreshSignal() {
            this.fetchTrafficData(this.period);
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'traffic/fetch' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const periods = {
                dec_week_1: {
                    from: '2015-12-01',
                    to: '2015-12-07'
                },
                dec_week_2: {
                    from: '2015-12-08',
                    to: '2015-12-14'
                },
                dec_week_3: {
                    from: '2015-12-15',
                    to: '2015-12-21'
                },
                dec_week_4: {
                    from: '2015-12-22',
                    to: '2015-12-28'
                },
                dec_week_5: {
                    from: '2015-12-29',
                    to: '2015-12-31'
                }
            };

            const filter = period ? { period: periods[period] } : null;

            const { totalTraffic } = await this.fetchTraffic({ filter });

            this.loading = false;
            this.totalTraffic = totalTraffic;
        }
    }
};
</script>
