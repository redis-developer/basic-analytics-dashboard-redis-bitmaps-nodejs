<template>
    <v-btn depressed color="error" large :loading="redisLoading" :disabled="redisLoading" @click="handleFlush" class="mt-3 mt-xl-0">
        Flush Redis
        <v-icon right dark>mdi-delete</v-icon>
    </v-btn>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({ redisLoading: 'getRedisLoading' })
    },

    methods: {
        ...mapActions({ flush: 'flush' }),
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL', setRedisLoading: 'SET_REDIS_LOADING' }),

        async handleFlush() {
            this.setRedisLoading(true);

            try {
                await this.flush();

                this.negateRefreshSignal();

                this.$notify({
                    group: 'main',
                    title: 'Redis',
                    text: 'Redis flushed!',
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
