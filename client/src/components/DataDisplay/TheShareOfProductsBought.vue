<template>
    <v-card class="card" :loading="loading">
        <v-card-title>Share of Products bought</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchSalesData" />
        </v-card-actions>

        <v-card-text>
            <base-pie-chart :chart-data="chartData" />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect'),
        basePieChart: () => import('@/components/UI/Charts/BasePieChart')
    },

    data() {
        return {
            product1Bought: 0,
            product2Bought: 0,
            product3Bought: 0,
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' }),

        chartData() {
            return {
                labels: ['Product1', 'Product2', 'Product3'],
                datasets: [
                    {
                        data: [this.product1Bought, this.product2Bought, this.product3Bought],
                        backgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 90)', 'rgba(0, 0, 255, 1)'],
                        borderWidth: 0
                    }
                ]
            };
        }
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

            const {
                productsBought: { product1, product2, product3 }
            } = await this.fetchSales({ filter: { period, search: [1, 2, 3] } });

            this.loading = false;
            this.product1Bought = product1;
            this.product2Bought = product2;
            this.product3Bought = product3;
        }
    }
};
</script>
