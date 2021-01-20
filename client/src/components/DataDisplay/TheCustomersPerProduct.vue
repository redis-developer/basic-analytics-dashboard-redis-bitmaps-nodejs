<template>
    <base-collection-card title="Customers who bought only" :data="customers" :loading="loading">
        <v-select v-model="product" :items="values" item-text="text" item-value="value" label="Product" outlined />
    </base-collection-card>
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
            product: 'product1',
            values: [
                { text: 'Product1', value: 'product1' },
                { text: 'Product2', value: 'product2' },
                { text: 'Product3', value: 'product3' }
            ],
            loading: false
        };
    },

    computed: {
        ...mapGetters({ refreshSignal: 'refreshSignal' })
    },

    watch: {
        product() {
            this.fetchProductsData();
        },

        refreshSignal() {
            this.fetchProductsData();
        }
    },

    created() {
        this.fetchProductsData();
    },

    methods: {
        ...mapActions({ fetchProducts: 'fetchProducts' }),

        async fetchProductsData() {
            this.loading = true;

            const [product] = await this.fetchProducts({ filter: { products: [this.product] } });

            this.customers = product.boughtBy;
            this.loading = false;
        }
    }
};
</script>
