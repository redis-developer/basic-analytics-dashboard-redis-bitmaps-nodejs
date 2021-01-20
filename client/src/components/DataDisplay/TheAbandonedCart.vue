<template>
    <v-card class="card" :loading="loading" outlined>
        <v-card-title class="pa-3">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon> mdi-help-box </v-icon>
                    </v-btn>
                </template>
                <span>Products: in cart vs bought</span>
            </v-tooltip>

            Abandoned Cart
        </v-card-title>

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
