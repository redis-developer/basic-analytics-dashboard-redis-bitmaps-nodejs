<template>
    <div class="btn">
        <v-btn @click="handleFlush">Flush Redis <v-icon>mdi-delete</v-icon></v-btn>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
    methods: {
        ...mapActions({ flush: 'admin/flush' }),
        ...mapMutations({ negateRefreshSignal: 'data/NEGATE_REFRESH_SIGNAL' }),

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

<style scoped>
.btn {
    position: fixed;
    top: 94%;
    left: 1%;
}

@media screen and (max-width: 1263px) {
    .btn {
        position: static;
        padding: 1%;
    }
}

@media screen and (max-height: 657px) {
    .btn {
        position: static;
        padding: 1%;
    }
}
</style>
