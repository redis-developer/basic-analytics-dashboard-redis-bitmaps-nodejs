<template>
    <v-card class="card" :loading="loading">
        <v-card-title class="px-4">Share of Products bought</v-card-title>

        <v-card-text class="px-10">
            <base-pie-chart :chart-data="chartData" />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        basePieChart: () => import('@/components/UI/Charts/BasePieChart')
    },

    data() {
        return {
            product1Bought: 0,
            product2Bought: 0,
            product3Bought: 0,
            loading: false
        };
    },

    computed: {
        ...mapGetters({
            refreshSignal: 'refreshSignal',
            period: 'getPeriod'
        }),

        chartData() {
            return {
                labels: ['Product1', 'Product2', 'Product3'],
                datasets: [
                    {
                        data: [this.product1Bought, this.product2Bought, this.product3Bought],
                        backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(200, 250, 5, 90)'],
                        borderWidth: 0
                    }
                ]
            };
        }
    },

    created() {
        this.fetchSalesData(this.period);
    },

    watch: {
        refreshSignal() {
            this.fetchSalesData(this.period);
        },
        period(period) {
            this.fetchSalesData(period);
        }
    },

    methods: {
        ...mapActions({ fetchSales: 'fetchSales' }),

        async fetchSalesData(period) {
            this.loading = true;

            const data = await this.fetchSales({ period, filter: { products: ['product1', 'product2', 'product3'] } });

            this.product1Bought = data.find(obj => obj.value === 'product1').bought;
            this.product2Bought = data.find(obj => obj.value === 'product2').bought;
            this.product3Bought = data.find(obj => obj.value === 'product3').bought;
            this.loading = false;
        }
    }
};
</script>
