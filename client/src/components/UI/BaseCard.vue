<template>
    <v-card :height="height" :loading="loading">
        <v-card-title>{{ title }}</v-card-title>

        <v-card-actions>
            <slot />
        </v-card-actions>

        <v-card-text>{{ data }}</v-card-text>

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
            type: Number,
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
