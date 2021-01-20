<template>
    <base-collection-card
        title="Customer Retention: Customers who bought on tho different dates"
        :data="customers"
        :loading="loading"
    />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        baseCollectionCard: () => import('@/components/UI/BaseCollectionCard')
    },

    data() {
        return {
            customers: [],
            loading: true
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'refreshSignal' })
    },

    watch: {
        refreshSignal() {
            this.fetchProductsData();
        }
    },

    created() {
        this.fetchProductsData();
    },

    methods: {
        ...mapActions({ fetchRetention: 'fetchRetention' }),

        async fetchProductsData() {
            this.loading = true;

            const data = await this.fetchRetention({ period: 'anytime' });

            this.customers = data;
            this.loading = false;
        }
    }
};
</script>
