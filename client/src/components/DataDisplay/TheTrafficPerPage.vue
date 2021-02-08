<template>
    <v-card class="card" :loading="loading">
        <v-card-title class="px-4">Traffic</v-card-title>

        <v-card-text class="px-4">
            <h2 class="font-weight-regular my-5">Total traffic</h2>

            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Visit count
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total traffic</td>
                        <td>{{ totalTraffic }}</td>
                    </tr>
                </tbody>
            </v-simple-table>

            <h2 class="font-weight-regular my-5">Traffic per page</h2>

            <v-simple-table>
                <thead>
                <tr>
                    <th class="text-left">
                        Page name
                    </th>
                    <th class="text-left">
                        Visit count
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Homepage</td>
                    <td>{{ homepageTraffic }}</td>
                </tr>
                <tr>
                    <td>Product 1 Page</td>
                    <td>{{ product1pageTraffic }}</td>
                </tr>
                <tr>
                    <td>Product 2 Page</td>
                    <td>{{ product2pageTraffic }}</td>
                </tr>
                <tr>
                    <td>Product 3 Page</td>
                    <td>{{ product3pageTraffic }}</td>
                </tr>
                </tbody>
            </v-simple-table>

        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            totalTraffic: 0,
            homepageTraffic: 0,
            product1pageTraffic: 0,
            product2pageTraffic: 0,
            product3pageTraffic: 0,
            loading: false
        };
    },

    computed: {
        ...mapGetters({
            refreshSignal: 'refreshSignal',
            traffic: 'getTraffic',
            period: 'getPeriod'
        })
    },

    created() {
        this.fetchTrafficData(this.period);
    },

    watch: {
        refreshSignal() {
            this.fetchTrafficData(this.period);
        },
        period(period) {
            this.fetchTrafficData(period);
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'fetchTraffic' }),

        async fetchTrafficData(period) {
            this.loading = true;

            const data = await this.fetchTraffic({
                filter: { pages: ['homepage', 'product1', 'product2', 'product3'] },
                period
            });

            const [totalTraffic] = await this.fetchTraffic({ filter: { total: true }, period });

            this.totalTraffic = totalTraffic.count;
            this.homepageTraffic = data.find(obj => obj.value === 'homepage').count;
            this.product1pageTraffic = data.find(obj => obj.value === 'product1').count;
            this.product2pageTraffic = data.find(obj => obj.value === 'product2').count;
            this.product3pageTraffic = data.find(obj => obj.value === 'product3').count;
            this.loading = false;
        }
    }
};
</script>
