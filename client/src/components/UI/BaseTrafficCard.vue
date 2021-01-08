<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>

        <v-card-text>{{ traffic }}</v-card-text>
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
        }
    }
};
</script>
