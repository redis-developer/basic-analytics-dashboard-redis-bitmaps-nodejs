<template>
    <v-card class="mb-6">
        <v-card-title class="px-5">Select date period</v-card-title>

        <v-card-actions class="px-5">
            <base-period-select @onSelect="updatePeriod" />
        </v-card-actions>
    </v-card>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        components: {
            basePeriodSelect: () => import('@/components/UI/BasePeriodSelect')
        },
        methods: {
            ...mapActions({ updatePeriod: 'updatePeriod' })
        }
    };
</script>
