<template>
    <v-card class="card" :loading="loading">
        <v-card-title>Trend chart (pages)</v-card-title>

        <v-card-actions>
            <base-period-select @onSelect="fetchTrafficData" />
        </v-card-actions>

        <v-card-text>
            <base-line-chart :chart-data="chartData" />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        baseLineChart: () => import('@/components/UI/Charts/BaseLineChart'),
        basePeriodSelect: () => import('@/components/UI/BasePeriodSelect')
    },

    data() {
        return {
            period: null,
            loading: false,
            datasets: []
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' }),

        chartData() {
            const backgroundColor = [
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)'
            ];

            const boderColors = [
                [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                [
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                [
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)'
                ]
            ];

            const borderWidth = 1;

            const labels = ['Homepage', 'Product1 Page', 'Product2 Page', 'Product3 Page'];

            const chartData = {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: []
            };

            this.datasets.forEach((dataset, index) => {
                chartData.datasets.push({
                    backgroundColor,
                    borderWidth,
                    data: dataset,
                    borderColor: boderColors[index],
                    label: labels[index]
                });
            });

            return chartData;
        }
    },

    watch: {
        refreshSignal() {
            this.fetchTrafficData(this.period);
        }
    },

    methods: {
        ...mapActions({ fetchTraffic: 'traffic/fetch' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const periods = {
                dec_week_1: ['dec_week_1'],
                dec_week_2: ['dec_week_1', 'dec_week_2'],
                dec_week_3: ['dec_week_3', 'dec_week_2', 'dec_week_1'],
                dec_week_4: ['dec_week_4', 'dec_week_3', 'dec_week_2', 'dec_week_1'],
                dec_week_5: ['dec_week_5', 'dec_week_4', 'dec_week_3', 'dec_week_2', 'dec_week_1']
            };

            const _period = !period ? periods.dec_week_5 : periods[period];

            const {
                homepageTraffic,
                product1pageTraffic,
                product2pageTraffic,
                product3pageTraffic
            } = await this.fetchTraffic({
                filter: {
                    period: _period,
                    search: ['homepage', 'product1page', 'product2page', 'product3page'],
                    type: 'page'
                }
            });

            this.loading = false;
            this.datasets = [];

            const homepageData = [];
            const product1pageData = [];
            const product2pageData = [];
            const product3pageData = [];

            for (let i = 1; i <= 5; i++) {
                if (
                    typeof homepageTraffic[`dec_week_${i}`] !== 'undefined' &&
                    typeof product1pageTraffic[`dec_week_${i}`] !== 'undefined' &&
                    typeof product2pageTraffic[`dec_week_${i}`] !== 'undefined' &&
                    typeof product3pageTraffic[`dec_week_${i}`] !== 'undefined'
                ) {
                    homepageData.push(homepageTraffic[`dec_week_${i}`]);
                    product1pageData.push(product1pageTraffic[`dec_week_${i}`]);
                    product2pageData.push(product2pageTraffic[`dec_week_${i}`]);
                    product3pageData.push(product3pageTraffic[`dec_week_${i}`]);
                }
            }

            this.datasets.push(homepageData, product1pageData, product2pageData, product3pageData);
        }
    }
};
</script>
