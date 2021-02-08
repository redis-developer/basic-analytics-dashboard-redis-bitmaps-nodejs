<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="3">
                <period-select-card/>

                <v-alert
                    type="info"
                    border="left"
                    class="mb-6"
                    text
                >
                    Below you can select date, source (the page user came from), user and action (register, visit, add to cart and buy product) performed on a website. When selected, click UPDATE button.
                </v-alert>

                <v-card>
                    <v-card-title class="pa-5">Analytics Demo Form</v-card-title>

                    <v-card-text class="px-5">
                        <the-analytics-demo-form />
                    </v-card-text>
                </v-card>

                <v-card-actions class="my-4 justify-md-space-around">
                    <v-btn depressed
                        color="info"
                        large
                        @click="negateRefreshSignal"
                    >
                        Refresh
                        <v-icon right dark >mdi-refresh</v-icon>
                    </v-btn>

                    <the-flush-button />

                </v-card-actions>
            </v-col>

            <v-col cols="12" lg="9">
                <the-analytics-data />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    components: {
        theAnalyticsDemoForm: () => import('@/components/TheAnalyticsDemoForm'),
        theAnalyticsData: () => import('@/components/TheAnalyticsData'),
        periodSelectCard: () => import('@/components/PeriodSelectCard'),
        theFlushButton: () => import('@/components/UI/TheFlushButton')
    },

    methods: {
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL' })
    }
};
</script>
