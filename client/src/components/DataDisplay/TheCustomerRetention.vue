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
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'data/refreshSignal' })
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
        ...mapActions({ fetchProducts: 'customers/fetchProducts' }),

        async fetchProductsData() {
            this.loading = true;

            const { twoDifferentDates } = await this.fetchProducts({ filter: { search: ['twoDifferentDates'] } });

            this.loading = false;
            this.customers = twoDifferentDates;
        }
    }
};
</script>
