<template>
    <v-card :loading="loading">
        <v-card-title>{{ title }}</v-card-title>

        <v-card-actions>
            <slot />
        </v-card-actions>

        <v-card-text>{{ traffic }}</v-card-text>

        <template #progress>
            <v-progress-linear indeterminate />
        </template>
    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        traffic: {
            type: Number,
            required: false,
            default: 0
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>
