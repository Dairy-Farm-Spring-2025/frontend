import React, { startTransition, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import English from '../../../../../../public/english.png';
import Vietnam from '../../../../../../public/vietnam.png';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import Title from '../../../../../components/UI/Title';

const ChangeLanguage: React.FC = () => {
  const [language, setLanguage] = useState<string>(
    localStorage.getItem('i18nextLng') || 'en'
  );
  const { t, i18n } = useTranslation();

  // Language options
  const languageOptions = [
    {
      value: 'en',
      label: (
        <div className="flex items-center gap-2">
          <img src={English} style={{ width: 20 }} />
          <span>{t('english')}</span>
        </div>
      ),
      icon: English,
    },
    {
      value: 'vi',
      label: (
        <div className="flex items-center gap-2">
          <img src={Vietnam} style={{ width: 20 }} />
          <span>{t('vietnamese')}</span>
        </div>
      ),
      icon: Vietnam,
    },
  ];

  const handleLanguageChange = (lng: string) => {
    localStorage.setItem('i18nextLng', lng);
    setLanguage(lng); // Update state
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng') || 'en'; // Fallback to 'en'
    i18n.changeLanguage(storedLanguage);
  }, [i18n]);

  return (
    <div className="language-selector">
      {/* Language dropdown */}
      <Title className="mb-5 text-xl">{t('choose_language')}</Title>
      <SelectComponent
        style={{ width: '100%' }}
        onChange={handleLanguageChange}
        placeholder="Select language"
        optionLabelProp="label"
        value={language}
        options={languageOptions}
      />
    </div>
  );
};

export default ChangeLanguage;
