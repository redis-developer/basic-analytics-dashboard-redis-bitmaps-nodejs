<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" lg="3">
                <v-card outlined>
                    <v-card-title>Analytics Demo Form</v-card-title>

                    <v-card-text>
                        <the-analytics-demo-form :max-users="15" />
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" lg="9">
                <v-card outlined>
                    <v-row>
                        <v-col cols="6">
                            <v-card-title>Analytics Data</v-card-title>
                        </v-col>

                        <v-col cols="6">
                            <v-card-actions>
                                <v-spacer />
                                <v-icon @click="negateRefreshSignal">mdi-refresh</v-icon>
                            </v-card-actions>
                        </v-col>
                    </v-row>

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
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL' })
    }
};
</script>
