<template>
    <v-card class="card" :loading="loading">
        <v-card-title> {{ title }} </v-card-title>

        <v-card-actions>
            <slot />
        </v-card-actions>

        <v-card-text>
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
