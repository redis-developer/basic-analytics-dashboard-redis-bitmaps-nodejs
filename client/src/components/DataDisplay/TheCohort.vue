<template>
    <v-card class="card">
        <v-card-title class="px-4">
            Cohort Analysis
        </v-card-title>

        <v-card-subtitle class="px-4">
            % of people who registered in December and then bought some product
        </v-card-subtitle>

        <v-card-text class="px-4">
            <v-row>
                <v-col cols="12" lg="7">
                    <v-simple-table>
                        <thead>
                        <tr>
                            <th class="text-left">
                               Name
                            </th>
                            <th class="text-left">
                                Count
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>People who registered</td>
                            <td>{{ register }}</td>
                        </tr>
                        <tr>
                            <td>People who bought</td>
                            <td>{{ registerThenBought }}</td>
                        </tr>
                        <tr>
                            <td>Dropoff</td>
                            <td>{{ dropoff || '0' }}</td>
                        </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>

                <v-col cols="12" lg="5">
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
        },
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
