<template>
    <div>
        <v-row>
            <v-col cols="12" lg="4">
                <h2>Traffic Analytics Data</h2>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="4">
                <the-total-traffic />
            </v-col>

            <v-col cols="12" lg="4">
                <the-traffic-per-page />
            </v-col>

            <v-col cols="12" lg="4">
                <the-trend />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <the-traffic-per-source />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2>Sales Analytics Data</h2>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="4">
                <the-total-products-bought />
            </v-col>

            <v-col cols="12" lg="4">
                <the-abandoned-cart />
            </v-col>

            <v-col cols="12" lg="4">
                <the-share-of-products-bought />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2>Customer and Cohort Analysis</h2>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="6">
                <the-cohort />
            </v-col>

            <v-col cols="12" lg="6">
                <the-customers-per-product />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="6">
                <the-customers-with-both-products />
            </v-col>

            <v-col cols="12" lg="6">
                <the-customer-retention />
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
        theTrend: () => import('@/components/DataDisplay/TheTrend'),
        theTotalProductsBought: () => import('@/components/DataDisplay/TheTotalProductsBought'),
        theAbandonedCart: () => import('@/components/DataDisplay/TheAbandonedCart'),
        theShareOfProductsBought: () => import('@/components/DataDisplay/TheShareOfProductsBought'),
        theCohort: () => import('@/components/DataDisplay/TheCohort'),
        theCustomersPerProduct: () => import('@/components/DataDisplay/TheCustomersPerProduct'),
        theCustomersWithBothProducts: () => import('@/components/DataDisplay/TheCustomersWithBothProducts'),
        theCustomerRetention: () => import('@/components/DataDisplay/TheCustomerRetention')
    }
};
</script>
