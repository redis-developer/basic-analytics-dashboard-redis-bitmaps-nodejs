<template>
    <v-card>
        <v-card-title>Traffic per Source</v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Google Ads" :traffic="googleTraffic" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Facebook Ads" :traffic="facebookTraffic" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Email" :traffic="emailTraffic" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Direct" :traffic="directTraffic" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Referral" :traffic="referralTraffic" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="None" :traffic="noneTraffic" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        baseTrafficCard: () => import('@/components/UI/BaseTrafficCard')
    },
    computed: {
        ...mapGetters({ trafficPerSource: 'traffic/perSource' }),
        googleTraffic() {
            return this.trafficPerSource('google');
        },
        facebookTraffic() {
            return this.trafficPerSource('facebook');
        },
        emailTraffic() {
            return this.trafficPerSource('email');
        },
        directTraffic() {
            return this.trafficPerSource('direct');
        },
        referralTraffic() {
            return this.trafficPerSource('referral');
        },
        noneTraffic() {
            return this.trafficPerSource('none');
        }
    }
};
</script>
