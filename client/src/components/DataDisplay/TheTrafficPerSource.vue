<template>
    <v-card>
        <v-card-title>Traffic per Source</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchTrafficData" />
        </v-card-actions>

        <v-card-text>
            <v-row>
                <v-col cols="12" lg="9">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <base-card title="Google Ads" :data="googleTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <base-card title="Facebook Ads" :data="facebookTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <base-card title="Email" :data="emailTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <base-card title="Direct" :data="directTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <base-card title="Referral" :data="referralTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <base-card title="None" :data="noneTraffic" :loading="loading" />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" lg="3">
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
        baseCard: () => import('@/components/UI/BaseCard'),
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect'),
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
            period: null,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' }),

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

            const data = await this.fetchTraffic({
                filter: { sources: ['google', 'facebook', 'email', 'direct', 'referral', 'none'] },
                period
            });

            this.loading = false;
            this.googleTraffic = data.find(obj => obj.value === 'google').count;
            this.facebookTraffic = data.find(obj => obj.value === 'facebook').count;
            this.emailTraffic = data.find(obj => obj.value === 'email').count;
            this.directTraffic = data.find(obj => obj.value === 'direct').count;
            this.referralTraffic = data.find(obj => obj.value === 'referral').count;
            this.noneTraffic = data.find(obj => obj.value === 'none').count;
        }
    }
};
</script>
