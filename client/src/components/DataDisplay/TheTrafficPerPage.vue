<template>
    <v-card>
        <v-card-title>Traffic per Page</v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Homepage" :traffic="homepageTraffic" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Product 1 Page" :traffic="product1pageTraffic" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <base-traffic-card title="Product 2 Page" :traffic="product2pageTraffic" />
                </v-col>

                <v-col cols="6">
                    <base-traffic-card title="Product 3 Page" :traffic="product3pageTraffic" />
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
        ...mapGetters({ trafficPerPage: 'traffic/perPage' }),
        homepageTraffic() {
            return this.trafficPerPage('homepage');
        },
        product1pageTraffic() {
            return this.trafficPerPage('product1page');
        },
        product2pageTraffic() {
            return this.trafficPerPage('product2page');
        },
        product3pageTraffic() {
            return this.trafficPerPage('product3page');
        }
    }
};
</script>
