<template>
    <v-app>
        <v-main>
            <v-container>
                <div class="my-8 d-flex align-center">
                    <div class="pa-4 rounded-lg red darken-1">
                        <v-icon color="white" size="45">mdi-chart-box-plus-outline</v-icon>
                    </div>
                    <h1 class="ml-6 font-weight-regular">Analytics Demo (Via Redis Bitmaps)</h1>
                </div>
            </v-container>

            <router-view />

            <v-container class="my-5">
                © Copyright 2021 | All Rights Reserved to Redis Labs
            </v-container>

            <notifications group="main" position="bottom center" />
        </v-main>
    </v-app>
</template>
