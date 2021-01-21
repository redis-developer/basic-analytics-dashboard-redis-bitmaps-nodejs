<template>
    <v-card class="card" outlined>
        <v-card-title class="pa-3">
            <v-tooltip top>
                <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon> mdi-help-box </v-icon>
                    </v-btn>
                </template>
                <span>% people who registered in December and then bought some product</span>
            </v-tooltip>

            Cohort Analysis
        </v-card-title>

        <v-card-text class="pa-3">
            <v-row>
                <v-col cols="12" lg="6">
                    <base-card title="People who registered" :data="register" :loading="loading" />
                </v-col>
                <v-col cols="12" lg="6">
                    <base-card title="People who bought" :data="registerThenBought" :loading="loading" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" lg="6">
                    <base-card title="Dropoff" :data="`${dropoff ? dropoff : '0'}%`" :loading="loading" />
                </v-col>
                <v-col cols="12" lg="6">
                    <base-horizontal-bar-chart :chart-data="chartData" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        baseCard: () => import('@/components/UI/BaseCard'),
        baseHorizontalBarChart: () => import('@/components/UI/Charts/BaseHorizontalBarChart')
    },

    data() {
        return {
            register: 0,
            registerThenBought: 0,
            dropoff: 0,
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'refreshSignal' }),

        chartData() {
            return {
                labels: ['Registered', 'Bought', 'Dropoff [in %]'],
                datasets: [
                    {
                        barPercentage: 0.5,
                        barThickness: 6,
                        maxBarThickness: 8,
                        minBarLength: 2,
                        data: [this.register, this.registerThenBought, this.dropoff],
                        label: 'December',
                        borderColor: 'rgba(225, 225, 60, 50)',
                        backgroundColor: 'rgba(225, 225, 60, 50)'
                    }
                ]
            };
        }
    },

    watch: {
        refreshSignal() {
            this.fetchCohortData();
        }
    },

    created() {
        this.fetchCohortData();
    },

    methods: {
        ...mapActions({ fetchCohort: 'fetchCohort' }),

        async fetchCohortData() {
            this.loading = true;

            const { register, registerThenBought, dropoff } = await this.fetchCohort();

            this.register = register;
            this.registerThenBought = registerThenBought;
            this.dropoff = dropoff;
            this.loading = false;
        }
    }
};
</script>

<style></style>
