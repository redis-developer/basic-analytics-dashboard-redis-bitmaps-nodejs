<template>
    <v-card class="card">
        <v-card-title>Traffic per Page</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchTrafficData" />
        </v-card-actions>

        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6">
                    <base-card title="Homepage" :data="homepageTraffic" :loading="loading" />
                </v-col>

                <v-col cols="12" sm="6">
                    <base-card title="Product 1 Page" :data="product1pageTraffic" :loading="loading" />
                </v-col>

                <v-col cols="12" sm="6">
                    <base-card title="Product 2 Page" :data="product2pageTraffic" :loading="loading" />
                </v-col>

                <v-col cols="12" sm="6">
                    <base-card title="Product 3 Page" :data="product3pageTraffic" :loading="loading" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
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
            homepageTraffic: 0,
            product1pageTraffic: 0,
            product2pageTraffic: 0,
            product3pageTraffic: 0,
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' })
    },

    watch: {
        refreshSignal() {
            this.fetchTrafficData(this.period);
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'traffic/fetch' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const {
                homepageTraffic,
                product1pageTraffic,
                product2pageTraffic,
                product3pageTraffic
            } = await this.fetchTraffic({
                filter: { period, search: ['homepage', 'product1page', 'product2page', 'product3page'], type: 'page' }
            });

            this.loading = false;
            this.homepageTraffic = homepageTraffic;
            this.product1pageTraffic = product1pageTraffic;
            this.product2pageTraffic = product2pageTraffic;
            this.product3pageTraffic = product3pageTraffic;
        }
    }
};
</script>
