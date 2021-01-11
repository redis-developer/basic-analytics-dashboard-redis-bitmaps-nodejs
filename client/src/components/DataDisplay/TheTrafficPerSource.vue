<template>
    <v-card>
        <v-card-title>Traffic per Source</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchTrafficData" />
        </v-card-actions>

        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Google Ads" :traffic="googleTraffic" :loading="loading" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Facebook Ads" :traffic="facebookTraffic" :loading="loading" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Email" :traffic="emailTraffic" :loading="loading" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Direct" :traffic="directTraffic" :loading="loading" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Referral" :traffic="referralTraffic" :loading="loading" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="None" :traffic="noneTraffic" :loading="loading" />
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
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect')
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
