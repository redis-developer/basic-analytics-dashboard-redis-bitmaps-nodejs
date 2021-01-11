<template>
    <div>
        <v-row>
            <v-col cols="4">
                <the-total-traffic />
            </v-col>

            <v-col cols="4">
                <the-traffic-per-page />
            </v-col>

            <v-col cols="4">
                <the-trend />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <the-traffic-per-source />
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    components: {
        theTotalTraffic: () => import('@/components/DataDisplay/TheTotalTraffic'),
        theTrafficPerPage: () => import('@/components/DataDisplay/TheTrafficPerPage'),
        theTrafficPerSource: () => import('@/components/DataDisplay/TheTrafficPerSource'),
        theTrend: () => import('@/components/DataDisplay/TheTrend')
    }
};
</script>
