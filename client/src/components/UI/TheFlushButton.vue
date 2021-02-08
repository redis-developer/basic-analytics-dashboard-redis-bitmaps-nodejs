<template>
    <v-btn
            depressed
            color="error"
            large
            @click="handleFlush"
    >
        Flush Redis
        <v-icon right dark >mdi-delete</v-icon>
    </v-btn>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
    methods: {
        ...mapActions({ flush: 'flush' }),
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL' }),

        async handleFlush() {
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
        }
    }
};
</script>
