<template>
    <v-app>
        <v-main>
            <h1 class="text-center my-12 px-4">Analytics Demo (Via Redis Bitmaps)</h1>

            <p class="subheader text-center mx-auto mb-12 px-4">
                In left sidebar you can select date, source (the page user came from), user and action (register, visit,
                add to cart and buy product) performed on a website. When selected, click UPDATE button. You can also
                update data with refresh button
            </p>

            <the-flush-button />

            <router-view />

            <notifications group="main" position="bottom center" />
        </v-main>
    </v-app>
</template>

<script>
export default {
    components: {
        theFlushButton: () => import('@/components/UI/TheFlushButton')
    }
};
</script>
