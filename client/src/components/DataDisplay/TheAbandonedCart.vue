<template>
    <v-card class="card" :loading="loading">
        <v-card-title>Abandoned Cart</v-card-title>

        <v-card-subtitle>(products in cart vs products bought)</v-card-subtitle>

        <v-card-actions>
            <base-period-select @onSelect="fetchSalesData" />
        </v-card-actions>

        <v-card-text>
            <div style="position: relative; width: 90%; margin: auto">
                <base-pie-chart :chart-data="chartData" />
            </div>
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
            productBought: 0,
            productsAddedToCart: 0,
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'refreshSignal' }),

        chartData() {
            return {
                labels: ['Added to Cart', 'Bought'],
                datasets: [
                    {
                        data: [this.productsAddedToCart, this.productBought],
                        backgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 90)'],
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
        ...mapActions({ fetchSales: 'fetchSales' }),

        async fetchSalesData(period) {
            this.period = period;
            this.loading = true;

            const [total] = await this.fetchSales({ period, filter: { total: true } });

            this.productBought = total.bought;
            this.productsAddedToCart = total.addedToCart;
            this.loading = false;
        }
    }
};
</script>
