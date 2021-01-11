<template>
    <v-card :height="500">
        <v-card-title>Traffic per Source</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchTrafficData" />
        </v-card-actions>

        <v-card-text>
            <v-row>
                <v-col cols="9">
                    <v-row>
                        <v-col cols="4">
                            <base-traffic-card title="Google Ads" :traffic="googleTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="4">
                            <base-traffic-card title="Facebook Ads" :traffic="facebookTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="4">
                            <base-traffic-card title="Email" :traffic="emailTraffic" :loading="loading" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="4">
                            <base-traffic-card title="Direct" :traffic="directTraffic" :loading="loading" />
                        </v-col>
                        <v-col cols="4">
                            <base-traffic-card title="Referral" :traffic="referralTraffic" :loading="loading" />
                        </v-col>

                        <v-col cols="4">
                            <base-traffic-card title="None" :traffic="noneTraffic" :loading="loading" />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="3">
                    <div style="position: relative">
                        <the-source-chart :chart-data="chartData" />
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
        baseTrafficCard: () => import('@/components/UI/BaseTrafficCard'),
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect'),
        theSourceChart: () => import('@/components/DataDisplay/Charts/TheSourceChart')
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
        },

        chartData() {
            return {};
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'traffic/fetch' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const {
                googleTraffic,
                facebookTraffic,
                emailTraffic,
                directTraffic,
                referralTraffic,
                noneTraffic
            } = await this.fetchTraffic({
                filter: {
                    period,
                    search: ['google', 'facebook', 'email', 'direct', 'referral', 'none'],
                    type: 'source'
                }
            });

            this.loading = false;
            this.googleTraffic = googleTraffic;
            this.facebookTraffic = facebookTraffic;
            this.emailTraffic = emailTraffic;
            this.directTraffic = directTraffic;
            this.referralTraffic = referralTraffic;
            this.noneTraffic = noneTraffic;
        }
    }
};
</script>
