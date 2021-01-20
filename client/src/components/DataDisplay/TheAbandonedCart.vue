<template>
    <v-card class="card" :loading="loading" outlined>
        <v-row>
            <v-col cols="6">
                <v-card-title class="pr-0 pl-3 py-3">Abandoned Cart</v-card-title>
            </v-col>
            <v-col cols="6">
                <v-card-subtitle class="pr-3 pl-0 py-3">(products: in cart vs bought)</v-card-subtitle>
            </v-col>
        </v-row>

        <v-card-actions class="pa-3">
            <base-period-select @onSelect="fetchSalesData" />
        </v-card-actions>

        <v-card-text class="pa-3">
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
                        backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
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
