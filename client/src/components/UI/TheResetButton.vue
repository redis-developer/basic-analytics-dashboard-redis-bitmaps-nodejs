<template>
    <v-btn
        depressed
        color="warning"
        large
        :loading="redisLoading"
        :disabled="redisLoading"
        style="width: 100%"
        @click="handleReset"
    >
        Reset Data
        <v-icon right dark>mdi-restart</v-icon>
    </v-btn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    computed: {
        ...mapGetters({ redisLoading: 'getRedisLoading' })
    },

    methods: {
        ...mapActions({ reset: 'reset' }),
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL', setRedisLoading: 'SET_REDIS_LOADING' }),

        async handleReset() {
            this.setRedisLoading(true);

            try {
                await this.reset();

                this.negateRefreshSignal();

                this.$notify({
                    group: 'main',
                    title: 'Data',
                    text: 'Data reseted!',
                    type: 'success',
                    duration: 400,
                    speed: 400
                });
            } catch (err) {
                console.error(err);

                this.$notify({
                    group: 'main',
                    title: 'Error',
                    text: 'Unexpected error occured.',
                    type: 'error',
                    duration: 400,
                    speed: 400
                });
            }

            this.setRedisLoading(false);
        }
    }
};
</script>
