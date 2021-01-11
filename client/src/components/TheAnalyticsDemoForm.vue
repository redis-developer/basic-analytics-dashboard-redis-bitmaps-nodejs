<template>
    <form @submit.prevent="submitForm">
        <v-select
            v-model="form.date"
            :items="selectValues.dateValues"
            item-text="text"
            item-value="value"
            label="Date"
        />

        <v-select
            v-model="form.source"
            :items="selectValues.sourceValues"
            item-text="text"
            item-value="value"
            label="Came From (Source)"
        />

        <v-select
            v-model="form.userId"
            :items="selectValues.userValues"
            item-text="text"
            item-value="value"
            label="User"
        />

        <v-select
            v-model="form.action"
            :items="selectValues.actionValues"
            item-text="text"
            item-value="value"
            label="Action"
        />

        <v-btn type="submit">Update</v-btn>
    </form>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions } from 'vuex';

export default {
    props: {
        maxUsers: {
            type: Number,
            required: false,
            default: 100
        }
    },

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

        for (let i = 0; i < this.maxUsers; i++) {
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
                action: 'homepage'
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
                    { text: 'Register', value: 'register' },
                    { text: 'Visit Homepage', value: 'homepage' },
                    { text: 'Visit Product1 Page', value: 'product1page' },
                    { text: 'Visit Product2 Page', value: 'product2page' },
                    { text: 'Visit Product3 Page', value: 'product3page' },
                    { text: 'Add Product1 to Cart', value: 'product1cart' },
                    { text: 'Add Product2 to Cart', value: 'product2cart' },
                    { text: 'Add Product3 to Cart', value: 'product3cart' },
                    { text: 'Buy Product1', value: 'product1buy' },
                    { text: 'Buy Product2', value: 'product2buy' },
                    { text: 'Buy Product3', value: 'product3buy' }
                ]
            }
        };
    },

    methods: {
        ...mapActions({ saveData: 'data/save' }),

        async submitForm() {
            await this.saveData(this.form);
        }
    }
};
</script>
