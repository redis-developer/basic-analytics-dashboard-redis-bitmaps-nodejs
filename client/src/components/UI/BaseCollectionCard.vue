<template>
    <v-card class="card" :loading="loading" outlined>
        <v-card-title class="pa-3"> {{ title }} </v-card-title>

        <v-card-actions class="pa-3">
            <slot />
        </v-card-actions>

        <v-card-text class="pa-3">
            <ul>
                <li v-for="item of data" :key="item">{{ item }}</li>
            </ul>
        </v-card-text>
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
            type: Array,
            required: false,
            default: () => []
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>
