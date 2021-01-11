<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
    mixins: [Line, reactiveProp],

    mounted() {
        this.renderChart(this.chartData);
    }
};
</script>
