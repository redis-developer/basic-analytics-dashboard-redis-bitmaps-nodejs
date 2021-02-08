<template>
    <v-card :height="height" :loading="loading">
        <v-card-title class="pa-3">{{ title }}</v-card-title>

        <v-card-actions class="pa-3">
            <slot />
        </v-card-actions>

        <v-card-text class="pa-3">{{ data }}</v-card-text>

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
        data: {
            type: [Number, String],
            required: false,
            default: 0
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        height: {
            type: Number,
            required: false,
            default: null
        }
    }
};
</script>
