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
        ...mapGetters({ refreshSignal: 'refreshSignal' })
    },

    watch: {
        refreshSignal() {
            this.fetchTrafficData(this.period);
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'fetchTraffic' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const [totalTraffic] = await this.fetchTraffic({ filter: { total: true }, period });

            this.totalTraffic = totalTraffic.count;
            this.loading = false;
        }
    }
};
</script>
