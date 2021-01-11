<template>
    <v-container fluid>
        <v-row>
            <v-col cols="3">
                <v-card>
                    <v-card-title>Analytics Demo Form</v-card-title>

                    <v-card-text>
                        <the-analytics-demo-form :max-users="5" />
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="9">
                <v-card>
                    <v-card-title>Analytics Data</v-card-title>

                    <v-card-actions>
                        <v-icon @click="negateRefreshSignal">mdi-refresh</v-icon>
                    </v-card-actions>

                    <v-card-text>
                        <the-analytics-data />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    components: {
        theAnalyticsDemoForm: () => import('@/components/TheAnalyticsDemoForm'),
        theAnalyticsData: () => import('@/components/TheAnalyticsData')
    },

    methods: {
        ...mapMutations({ negateRefreshSignal: 'data/NEGATE_REFRESH_SIGNAL' })
    }
};
</script>
