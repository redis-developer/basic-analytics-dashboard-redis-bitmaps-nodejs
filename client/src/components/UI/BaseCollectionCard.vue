<template>
    <v-card class="card" :loading="loading">
        <v-card-title class="px-4"> {{ title }} </v-card-title>

        <v-card-subtitle v-if="subtitle && subtitle.length" class="px-4">
            {{ subtitle }}
        </v-card-subtitle>

        <v-card-actions class="px-4">
            <slot />
        </v-card-actions>

        <v-card-text class="px-4">
            <v-simple-table fixed-header height="300px">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                                v-for="item in data"
                                :key="item"
                        >
                            <td>{{ item }}</td>
                        </tr>
                    </tbody>
            </v-simple-table>
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
        subtitle: {
            type: String,
            required: false
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
