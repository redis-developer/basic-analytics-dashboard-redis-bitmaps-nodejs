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

            const { productsBought } = await this.fetchSales({ filter });

            this.loading = false;
            this.totalProductBought = productsBought;
        }
    }
};
</script>
