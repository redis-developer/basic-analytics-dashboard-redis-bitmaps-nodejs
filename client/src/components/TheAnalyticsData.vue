<template>
    <div>
       <v-card class="mx-1">
           <v-tabs v-model="tab">
               <v-tab>Traffic Analytics Data</v-tab>
               <v-tab>Sales Analytics Data</v-tab>
               <v-tab>Customer and Cohort Analysis</v-tab>
           </v-tabs>
       </v-card>

        <v-alert
                text
                dense
                color="info"
                class="mt-6 mb-0 mx-1"
                border="left"
        >
            <v-row
                align="center"
                no-gutters
                @click="alert = !alert"
            >
                <v-col class="grow">
                    <h3 class="headline">
                        How it works?
                    </h3>
                </v-col>
                <v-col class="shrink">
                    <v-btn
                        color="info"
                        outlined
                    >
                        {{ alert ? 'Collapse' : 'View more'}}
                    </v-btn>
                </v-col>
            </v-row>

            <v-divider v-show="alert"
                class="my-4 info"
                style="opacity: 0.22"
            ></v-divider>

            <div v-show="alert">
                <ol>
                    <li class="font-weight-bold">How the data is stored:</li>
                    <ul class="mb-5">
                        <li>The event data is stored in various keys and various data types.</li>
                        <ul class="mb-5">
                            <li>For each of time spans:</li>
                            <ul class="mb-5">
                                <li>year: like 2021</li>
                                <li>month: like 2021-03 (means March of 2021)</li>
                                <li>day: like 2021-03-03 (means 3rd March of 2021)</li>
                                <li>weekOfMonth: like 2021-03/4 (means 4th week of March 2021)</li>
                                <li>anytime</li>
                            </ul>
                            <li>and for each of scopes:</li>
                            <ul class="mb-5">
                                <li>source</li>
                                <li>action</li>
                                <li>source + action</li>
                                <li>action + page</li>
                                <li>userId + action</li>
                                <li>global</li>
                            </ul>
                            <li>and for each of data types (types):</li>
                            <ul class="mb-5">
                                <li>count (Integer stored as String)</li>
                                <li>bitmap</li>
                                <li>set</li>
                            </ul>
                            <li>Is generated key like: <code>{prefix}:{type}[:custom:{customName}][:user:{userId}][:source:{source}][:action:{action}][:page:{page}]:timeSpan:{timeSpan}</code>, where values in <code>[]</code> are optional.</li>
                        </ul>
                        <li>For each generated key like <code>{prefix}:count:*</code>, data is stored like: <code>INCR {key}</code></li>
                        <li>For each generated key like <code>{prefix}:set:*</code>, data is stored like: <code>SADD {key} {userId}</code></li>
                        <li>For each generated key like <code>{prefix}:bitmap:*</code>, data is stored like: <code>SETBIT {key} {userId} 1</code>.</li>
                        <li>Retention data is stored like: <code>SADD {prefix}:set:custom:retention-buy:timeSpan:{timeSpan} {userId}</code></li>
                        <li>Cohort data is stored like: <code>SETBIT {prefix}:bitmap:custom:cohort-buy:timeSpan:{timeSpan} userId 1</code></li>
                    </ul>

                    <li class="font-weight-bold">How the data is accessed:</li>
                    <ul class="mb-5">

                        <li>Total Traffic:</li>
                        <ul class="mb-5">
                            <li>December: <code>BITCOUNT {prefix}:bitmap:custom:global:timeSpan:2015-12</code></li>
                            <li>BITCOUNT <code>{prefix}:bitmap:custom:global:timeSpan:2015-12</code></li>
                        </ul>

                        <li>Traffic per Page ({page} is one of: homepage, product1, product2, product3):</li>
                        <ul class="mb-5">
                            <li>December: <code>BITCOUNT {prefix}:bitmap:action:visit:page:{page}:timeSpan:2015-12</code></li>
                            <li>X week of December: BITCOUNT {prefix}:bitmap:action:visit:page:{page}:timeSpan:2015-12/{X}</li>
                        </ul>

                        <li>Traffic per Source ({source} is one of: google, Facebook, email, direct, referral, none):</li>
                        <ul class="mb-5">
                            <li>December: <code>BITCOUNT {prefix}:bitmap:source:{source}:timeSpan:2015-12</code></li>
                            <li>X week of December: <code>BITCOUNT {prefix}:bitmap:source:{source}:timeSpan:2015-12/{X}</code></li>
                        </ul>

                        <li>Trend traffic ({page} is one of: homepage, product1, product2, product3):</li>
                        <ul class="mb-5">
                            <li>December: <code>BITCOUNT {prefix}:bitmap:action:visit:{page}:timeSpan:2015-12-01 … BITCOUNT {prefix}:bitmap:action:visit:{page}:timeSpan:2015-12-31</code></li>
                            <li>1 Week of December: Similar as above, but: 2015-12-01 … 2015-12-07</li>
                            <li>2 Week of December: Similar as above, but: 2015-12-08 … 2015-12-14</li>
                            <li>3 Week of December: Similar as above, but: 2015-12-15 … 2015-12-21</li>
                            <li>4 Week of December: Similar as above, but: 2015-12-22 … 2015-12-28</li>
                            <li>5 Week of December: Similar as above, but: 2015-12-29 … 2015-12-31</li>
                        </ul>

                        <li>Total products bought:</li>
                        <ul class="mb-5">
                            <li>December: <code>GET {prefix}:count:action:buy:timeSpan:2015-12</code></li>
                            <li>X week of December: <code>GET {prefix}:count:action:buy:timeSpan:2015-12/{X}</code></li>
                        </ul>

                        <li>Total products added to cart:</li>
                        <ul class="mb-5">
                            <li>December: <code>GET {prefix}:count:action:addToCart:timeSpan:2015-12</code></li>
                            <li>X week of December: <code>GET {prefix}:count:action:addToCart:timeSpan:2015-12/{X}</code></li>
                        </ul>

                        <li>Shares of products bought ({productPage} is on of product1, product2, product3):</li>
                        <ul class="mb-5">
                            <li>December: <code> GET{prefix}:count:action:buy:page:{productPage}:timeSpan:2015-12</code></li>
                            <li>X week of December: <code>GET {prefix}:count:action:buy:page:{productPage}:timeSpan:2015-12/{X}</code></li>
                        </ul>

                        <li>Customer and Cohort Analysis:</li>
                        <ul class="mb-5">
                            <li>People who registered: <code>BITCOUNT {prefix}:bitmap:action:register:timeSpan:2015-12</code></li>
                            <li>People who register then bought (order matters): <code>BITCOUNT {prefix}:bitmap:custom:cohort-buy:timeSpan:2015-12</code></li>
                            <li>Dropoff: (People who register then bought / People who register) * 100 [%]</li>
                        </ul>
                        <li>Customers who bought only specified product ({productPage} is one of: product1, product2, product3): <code>SMEMBERS {prefix}:set:action:buy:page:{productPage}:timeSpan:2015-12</code></li>
                        <li>Customers who bought Product1 and Product2: <code>SINTER {prefix}:set:action:buy:page:product1:timeSpan:2015-12 {prefix}:set:action:buy:page:product2:timeSpan:2015-12</code></li>
                        <li>Customer Retention (customers who bought on the different dates): <code>SMEMBERS {prefix}:set:custom:retention-buy:timeSpan:2015-12</code></li>
                    </ul>
                </ol>
             </div>
        </v-alert>

        <v-tabs-items v-model="tab" style="background:none;" class="pb-6 px-1 mb-6">
            <v-tab-item>
                <v-row class="mt-3">
                    <v-col cols="12" lg="6">
                        <the-traffic-per-page />
                    </v-col>

                    <v-col cols="12" lg="6">
                        <the-trend />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <the-traffic-per-source />
                    </v-col>
                </v-row>
            </v-tab-item>

            <v-tab-item>
                <v-row class="mt-3">
                    <v-col cols="12" lg="12">
                        <the-total-products-bought />
                    </v-col>

                    <v-col cols="12" lg="6">
                        <the-abandoned-cart />
                    </v-col>

                    <v-col cols="12" lg="6">
                        <the-share-of-products-bought />
                    </v-col>
                </v-row>
            </v-tab-item>

            <v-tab-item>
                <v-row class="mt-3">
                    <v-col cols="12" lg="8">
                        <the-cohort />
                    </v-col>

                    <v-col cols="12" lg="4">
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
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tab: null,
            alert: false,
        };
    },
    components: {
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
