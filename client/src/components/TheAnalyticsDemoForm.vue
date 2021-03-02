<template>
    <form @submit.prevent="submitForm">
            <v-select
                    v-model="form.date"
                    :items="selectValues.dateValues"
                    item-text="text"
                    item-value="value"
                    label="Date"
                    outlined
            />

            <v-select
                    v-model="form.source"
                    :items="selectValues.sourceValues"
                    item-text="text"
                    item-value="value"
                    label="Came From (Source)"
                    outlined
            />

            <v-select
                    v-model="form.userId"
                    :items="selectValues.userValues"
                    item-text="text"
                    item-value="value"
                    label="User"
                    outlined
            />

            <v-select
                    v-model="form.actionParams"
                    :items="selectValues.actionValues"
                    item-text="text"
                    item-value="value"
                    label="Action"
                    outlined
            />

        <div class="text-right">
            <v-btn type="submit" color="primary" large>
                Create Data
                <v-icon
                        right
                        dark
                >
                    mdi-cloud-upload
                </v-icon>
            </v-btn>
        </div>
    </form>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapMutations } from 'vuex';

export default {
    data() {
        const dateValues = [];
        const userValues = [];

        for (let i = 0; i <= 30; i++) {
            const date = dayjs('2015-12-01').add(i, 'day');

            dateValues.push({
                text: date.format('ddd, DD MMM YYYY'),
                value: date.format('YYYY-MM-DD')
            });
        }

        for (let i = 0; i < 20; i++) {
            userValues.push({
                text: `User${i + 1}`,
                value: i
            });
        }

        return {
            form: {
                date: dayjs('2015-12-01').format('YYYY-MM-DD'),
                source: 'facebook',
                userId: 1,
                actionParams: { action: 'visit', page: 'homepage' }
            },
            selectValues: {
                dateValues,
                sourceValues: [
                    { text: 'Google Ads', value: 'google' },
                    { text: 'Facebook Ads', value: 'facebook' },
                    { text: 'Email', value: 'email' },
                    { text: 'Direct', value: 'direct' },
                    { text: 'Referral', value: 'referral' },
                    { text: 'None', value: 'none' }
                ],
                userValues,
                actionValues: [
                    { text: 'Register', value: { action: 'register' } },
                    { text: 'Visit Homepage', value: { action: 'visit', page: 'homepage' } },
                    { text: 'Visit Product1 Page', value: { action: 'visit', page: 'product1' } },
                    { text: 'Visit Product2 Page', value: { action: 'visit', page: 'product2' } },
                    { text: 'Visit Product3 Page', value: { action: 'visit', page: 'product3' } },
                    { text: 'Add Product1 to Cart', value: { action: 'addToCart', page: 'product1' } },
                    { text: 'Add Product2 to Cart', value: { action: 'addToCart', page: 'product2' } },
                    { text: 'Add Product3 to Cart', value: { action: 'addToCart', page: 'product3' } },
                    { text: 'Buy Product1', value: { action: 'buy', page: 'product1' } },
                    { text: 'Buy Product2', value: { action: 'buy', page: 'product2' } },
                    { text: 'Buy Product3', value: { action: 'buy', page: 'product3' } }
                ]
            }
        };
    },

    methods: {
        ...mapActions({ saveData: 'saveData' }),
        ...mapMutations({ negateRefreshSignal: 'NEGATE_REFRESH_SIGNAL' }),

        async submitForm() {
            await this.saveData(this.form);

            this.negateRefreshSignal();

            this.$notify({
                group: 'main',
                title: 'Form',
                text: 'Data updated!',
                type: 'success',
                duration: 400,
                speed: 400
            });
        }
    }
};
</script>
