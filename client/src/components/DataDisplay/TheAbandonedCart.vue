<template>
    <v-card class="card" :loading="loading">
        <v-card-title class="px-4">Abandoned Cart</v-card-title>
        <v-card-subtitle>Products: in cart vs bought</v-card-subtitle>

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
            productBought: 0,
            productsAddedToCart: 0,
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
                labels: ['Added to Cart', 'Bought'],
                datasets: [
                    {
                        data: [this.productsAddedToCart, this.productBought],
                        backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
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

            const [total] = await this.fetchSales({ period, filter: { total: true } });

            this.productBought = total.bought;
            this.productsAddedToCart = total.addedToCart;
            this.loading = false;
        }
    }
};
</script>
