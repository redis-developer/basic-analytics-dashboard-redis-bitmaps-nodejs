<template>
    <base-traffic-card class="traffic-card" title="Total Traffic" :traffic="totalTraffic" :loading="loading">
        <base-period-select @onSelect="fetchTrafficData" />
    </base-traffic-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        baseTrafficCard: () => import('@/components/UI/BaseTrafficCard'),
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

            const { totalTraffic } = await this.fetchTraffic({ filter: { period } });

            this.loading = false;
            this.totalTraffic = totalTraffic;
        }
    }
};
</script>
