<template>
    <base-collection-card title="Customers who bought Product1 and Product2" :data="customers" :loading="loading" />
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

            const [product1and2] = await this.fetchProducts({
                filter: { products: [] },
                join: JSON.stringify(['product1', 'product2']),
                period: 'anytime'
            });

            this.loading = false;
            this.customers = product1and2.boughtBy;
        }
    }
};
</script>
