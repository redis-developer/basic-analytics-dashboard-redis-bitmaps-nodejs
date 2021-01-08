<template>
    <v-row>
        <v-col cols="4">
            <the-total-traffic />
        </v-col>

        <v-col cols="4">
            <the-traffic-per-page />
        </v-col>

        <v-col cols="4">
            <the-traffic-per-source />
        </v-col>
    </v-row>
</template>

<script>
export default {
    components: {
        theTotalTraffic: () => import('@/components/DataDisplay/TheTotalTraffic'),
        theTrafficPerPage: () => import('@/components/DataDisplay/TheTrafficPerPage'),
        theTrafficPerSource: () => import('@/components/DataDisplay/TheTrafficPerSource')
    }
};
</script>
