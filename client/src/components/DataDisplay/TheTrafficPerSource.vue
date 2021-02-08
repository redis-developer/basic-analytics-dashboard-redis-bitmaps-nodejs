<template>
    <v-card :loading="loading">
        <v-card-title class="px-4">Traffic per Source</v-card-title>

        <v-card-text class="px-4">
            <v-row>
                <v-col cols="12" lg="8">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Source name
                                </th>
                                <th class="text-left">
                                    Visit count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Google Ads</td>
                                <td>{{ googleTraffic }}</td>
                            </tr>
                            <tr>
                                <td>Facebook Ads</td>
                                <td>{{ facebookTraffic }}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{{ emailTraffic }}</td>
                            </tr>
                            <tr>
                                <td>Direct</td>
                                <td>{{ directTraffic }}</td>
                            </tr>
                            <tr>
                                <td>Referral</td>
                                <td>{{ referralTraffic }}</td>
                            </tr>
                            <tr>
                                <td>None</td>
                                <td>{{ noneTraffic }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>

                <v-col cols="12" lg="4">
                    <div style="position: relative">
                        <base-pie-chart :chart-data="chartData" />
                    </div>
                </v-col>
            </v-row>
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
            googleTraffic: 0,
            facebookTraffic: 0,
            emailTraffic: 0,
            directTraffic: 0,
            referralTraffic: 0,
            noneTraffic: 0,
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
                labels: ['Google Ads', 'Facebook Ads', 'Email', 'Direct', 'Referral', 'None'],
                datasets: [
                    {
                        data: [
                            this.googleTraffic,
                            this.facebookTraffic,
                            this.emailTraffic,
                            this.directTraffic,
                            this.referralTraffic,
                            this.noneTraffic
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(60, 192, 1, 192)',
                            'rgba(200, 250, 5, 90)'
                        ],
                        borderWidth: 0
                    }
                ]
            };
        }
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
                filter: { sources: ['google', 'facebook', 'email', 'direct', 'referral', 'none'] },
                period
            });

            this.googleTraffic = data.find(obj => obj.value === 'google').count;
            this.facebookTraffic = data.find(obj => obj.value === 'facebook').count;
            this.emailTraffic = data.find(obj => obj.value === 'email').count;
            this.directTraffic = data.find(obj => obj.value === 'direct').count;
            this.referralTraffic = data.find(obj => obj.value === 'referral').count;
            this.noneTraffic = data.find(obj => obj.value === 'none').count;
            this.loading = false;
        }
    }
};
</script>
