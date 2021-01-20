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
            datasets: [],
            labels: []
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'refreshSignal' }),

        chartData() {
            const backgroundColor = [
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)'
            ];

            const borderColorGenerator = borderColor => {
                const colors = [];

                for (let i = 0; i < 31; i++) {
                    colors.push(borderColor);
                }

                return colors;
            };

            const boderColors = [
                borderColorGenerator('rgba(255, 99, 132, 1)'),
                borderColorGenerator('rgba(54, 162, 235, 1)'),
                borderColorGenerator('rgba(255, 206, 86, 1)'),
                borderColorGenerator('rgba(75, 192, 192, 1)')
            ];

            const borderWidth = 1;

            const labels = ['Homepage', 'Product1 Page', 'Product2 Page', 'Product3 Page'];

            const chartData = {
                labels: this.labels,
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
        ...mapActions({ fetchTrend: 'fetchTrend' }),

        async fetchTrafficData(period) {
            this.period = period;

            const periods = {
                '2015-12/1': {
                    from: '2015-12-01',
                    to: '2015-12-07',
                    labels: [
                        '2015-12-01',
                        '2015-12-02',
                        '2015-12-03',
                        '2015-12-04',
                        '2015-12-05',
                        '2015-12-06',
                        '2015-12-07'
                    ]
                },
                '2015-12/2': {
                    from: '2015-12-08',
                    to: '2015-12-14',
                    labels: [
                        '2015-12-08',
                        '2015-12-09',
                        '2015-12-10',
                        '2015-12-11',
                        '2015-12-12',
                        '2015-12-13',
                        '2015-12-14'
                    ]
                },
                '2015-12/3': {
                    from: '2015-12-15',
                    to: '2015-12-21',
                    labels: [
                        '2015-12-15',
                        '2015-12-16',
                        '2015-12-17',
                        '2015-12-18',
                        '2015-12-19',
                        '2015-12-20',
                        '2015-12-21'
                    ]
                },
                '2015-12/4': {
                    from: '2015-12-22',
                    to: '2015-12-28',
                    labels: [
                        '2015-12-22',
                        '2015-12-23',
                        '2015-12-24',
                        '2015-12-25',
                        '2015-12-26',
                        '2015-12-27',
                        '2015-12-28'
                    ]
                },
                '2015-12/5': {
                    from: '2015-12-29',
                    to: '2015-12-31',
                    labels: ['2015-12-29', '2015-12-30', '2015-12-31']
                }
            };

            const { from, to } = periods[period] || {};

            this.loading = true;

            const data = await this.fetchTrend({
                filter: { pages: ['homepage', 'product1', 'product2', 'product3'] },
                period: { from, to }
            });

            this.datasets = [];
            this.labels = periods[period]
                ? periods[period].labels
                : [
                      '2015-12-01',
                      '2015-12-02',
                      '2015-12-03',
                      '2015-12-04',
                      '2015-12-05',
                      '2015-12-06',
                      '2015-12-07',
                      '2015-12-08',
                      '2015-12-09',
                      '2015-12-10',
                      '2015-12-11',
                      '2015-12-12',
                      '2015-12-13',
                      '2015-12-14',
                      '2015-12-15',
                      '2015-12-16',
                      '2015-12-17',
                      '2015-12-18',
                      '2015-12-19',
                      '2015-12-20',
                      '2015-12-21',
                      '2015-12-22',
                      '2015-12-23',
                      '2015-12-24',
                      '2015-12-25',
                      '2015-12-26',
                      '2015-12-27',
                      '2015-12-28',
                      '2015-12-29',
                      '2015-12-30',
                      '2015-12-31'
                  ];

            const homepageData = data.filter(obj => obj.value === 'homepage').map(obj => obj.count);
            const product1pageData = data.filter(obj => obj.value === 'product1').map(obj => obj.count);
            const product2pageData = data.filter(obj => obj.value === 'product2').map(obj => obj.count);
            const product3pageData = data.filter(obj => obj.value === 'product3').map(obj => obj.count);

            this.datasets.push(homepageData, product1pageData, product2pageData, product3pageData);
            this.loading = false;
        }
    }
};
</script>
