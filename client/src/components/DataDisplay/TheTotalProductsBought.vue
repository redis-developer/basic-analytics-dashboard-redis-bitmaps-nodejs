<template>
    <base-card class="card" title="Total Product Bought" :data="totalProductBought">
        <base-period-select @onSelect="fetchSalesData" />
    </base-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        baseCard: () => import('@/components/UI/BaseCard'),
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect')
    },

    data() {
        return {
            totalProductBought: 0,
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' })
    },

    watch: {
        refreshSignal() {
            this.fetchSalesData(this.period);
        }
    },

    methods: {
        ...mapActions({ fetchSales: 'sales/fetch' }),

        async fetchSalesData(period) {
            this.period = period;
            this.loading = true;

            const [total] = await this.fetchSales({ period, filter: { total: true } });

            this.loading = false;
            this.totalProductBought = total.bought;
        }
    }
};
</script>
