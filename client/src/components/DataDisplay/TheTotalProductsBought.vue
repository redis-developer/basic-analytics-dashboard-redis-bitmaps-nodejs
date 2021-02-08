<template>
    <v-card class="card" :loading="loading">
        <v-card-title class="px-4">Product Bought</v-card-title>

        <v-card-text class="px-4">
            <v-simple-table>
               <tbody>
                    <tr>
                        <td>Total Product Bought</td>
                        <td>{{ totalProductBought }}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            totalProductBought: 0,
            loading: false
        };
    },

    computed: {
        ...mapGetters({
            refreshSignal: 'refreshSignal',
            period: 'getPeriod'
        })
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

            this.totalProductBought = total.bought;
            this.loading = false;
        }
    }
};
</script>
