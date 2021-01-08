<template>
    <base-traffic-card title="Total Traffic" :traffic="totalTraffic" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        baseTrafficCard: () => import('@/components/UI/BaseTrafficCard')
    },

    computed: {
        ...mapGetters({ totalTraffic: 'traffic/total' })
    }
};
</script>
