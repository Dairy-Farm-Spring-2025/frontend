import i18n from 'i18next';
export const COW_TYPE_FILTER = () => {
    return [
        {
            value: 'ayrshire',
            text: i18n.t('Ayrshire', { defaultValue: 'Ayrshire' }),
        },
        {
            value: 'guernsey',
            text: i18n.t('Guernsey', { defaultValue: 'Guernsey' }),
        },
        {
            value: 'jersey',
            text: i18n.t('Jersey', { defaultValue: 'Jersey' }),
        },
        {
            value: 'Holstein Friesian',
            text: i18n.t('Holstein Friesian', { defaultValue: 'Holstein Friesian' }),
        },
        {
            value: 'brownSwiss',
            text: i18n.t('Brown Swiss', { defaultValue: 'Brown Swiss' }),
        },
    ];
};
export const Cow_type = () => {
    return [
        {
            value: 'ayrshire',
            label: i18n.t('Ayrshire'),
        },
        {
            value: 'guernsey',
            label: i18n.t('Guernsey'),
        },
        {
            value: 'jersey',
            label: i18n.t('Jersey'),
        },
        {
            value: 'Holstein Friesian',
            label: i18n.t('Holstein Friesian'),
        },
        {
            value: 'brownSwiss',
            label: i18n.t('Brown Swiss'),
        },
    ];
};