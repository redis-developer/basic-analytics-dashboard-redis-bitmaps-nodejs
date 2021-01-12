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
        ...mapGetters({ refreshSignal: 'data/refreshSignal' }),

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
        ...mapActions({ fetchTraffic: 'traffic/fetch' }),

        async fetchTrafficData(period) {
            this.period = period;
            this.loading = true;

            const periods = {
                dec_week_1: {
                    from: '2015-12-01',
                    to: '2015-12-07'
                },
                dec_week_2: {
                    from: '2015-12-08',
                    to: '2015-12-14'
                },
                dec_week_3: {
                    from: '2015-12-15',
                    to: '2015-12-21'
                },
                dec_week_4: {
                    from: '2015-12-22',
                    to: '2015-12-28'
                },
                dec_week_5: {
                    from: '2015-12-29',
                    to: '2015-12-31'
                }
            };

            const filter = {
                search: ['homepage', 'product1page', 'product2page', 'product3page'],
                type: 'page',
                trend: true
            };

            if (period) {
                filter.period = periods[period];
            }

            const {
                homepageTraffic: { trend: homepageTrend },
                product1pageTraffic: { trend: product1pageTrend },
                product2pageTraffic: { trend: product2pageTrend },
                product3pageTraffic: { trend: product3pageTrend }
            } = await this.fetchTraffic({ filter });

            this.loading = false;
            this.datasets = [];
            this.labels = [];

            const homepageData = [];
            const product1pageData = [];
            const product2pageData = [];
            const product3pageData = [];

            const dates = Object.keys(homepageTrend);

            dates.forEach(date => {
                homepageData.push(homepageTrend[date]);
                product1pageData.push(product1pageTrend[date]);
                product2pageData.push(product2pageTrend[date]);
                product3pageData.push(product3pageTrend[date]);

                this.labels.push(date);
            });

            this.datasets.push(homepageData, product1pageData, product2pageData, product3pageData);
        }
    }
};
</script>
