import { t } from 'i18next';

const RulesCreateTask = () => {
  const CLASS_TITLE = 'text-base font-semibold';
  return (
    <div>
      <p className="font-bold text-xl">📌 {t('Task Creation Rules:')}</p>
      <ol className="list-decimal ml-8 mt-2 text-base">
        <li>
          <span className={CLASS_TITLE}>
            {t('Check-up, Treatment, Vaccination')}
          </span>
          <ol className="list-disc ml-4 my-2">
            <li>
              {t('Can')}{' '}
              <strong>
                {t(
                  'perform multiple tasks in different areas within the same day'
                )}
              </strong>
              .
            </li>
          </ol>
        </li>

        <li>
          <span className={CLASS_TITLE}>{t('Regular Check-up')}</span>
          <ol className="list-disc ml-4 flex flex-col gap-2 my-2">
            <li>
              <strong>{t('Can only be performed in one single area')}</strong>{' '}
              {t('within a specific period of time.')}
            </li>
            <li>
              <strong>
                {t('If the veterinarian is performing a Regular Check-up')}
              </strong>
              , {t('they')}{' '}
              <strong>
                {t('must not be assigned additional tasks such as')}
              </strong>{' '}
              <span className="italic">
                {t('Check-up, Treatment, Vaccination')}
              </span>{' '}
              {t('within that same time period.')}
            </li>
          </ol>
        </li>
        <li>
          <span className={CLASS_TITLE}>
            {t('Feeding, Night Shift, Cleaning the Barn, Milking')}
          </span>
          <ol className="list-disc ml-4 my-2">
            <li>
              {t('Can')}{' '}
              <strong>{t('perform multiple tasks in the same area')}</strong>{' '}
              {t('within the same day.')}
            </li>
          </ol>
        </li>
      </ol>
    </div>
  );
};

export default RulesCreateTask;
