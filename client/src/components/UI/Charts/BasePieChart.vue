<script>
import { Pie, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
    mixins: [Pie, reactiveProp],

    mounted() {
        this.renderChart(this.chartData);
    }
};
</script>

<style></style>
