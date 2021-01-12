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
        ...mapGetters({ refreshSignal: 'data/refreshSignal' }),

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
        ...mapActions({ fetchSales: 'sales/fetch' }),

        async fetchSalesData(period) {
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

            const { productsBought, productsAddedToCart } = await this.fetchSales({ filter });

            this.loading = false;
            this.productBought = productsBought;
            this.productsAddedToCart = productsAddedToCart;
        }
    }
};
</script>
