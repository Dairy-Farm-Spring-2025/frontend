import React, { memo, useMemo } from 'react';
import { Button, ConfigProvider, Modal, ModalProps, Typography } from 'antd';
import { CgClose } from 'react-icons/cg';
import ButtonComponent from '../Button/ButtonComponent';
import './index.scss';
import { t } from 'i18next';

interface ModalComponentInterface extends ModalProps {
  children: React.ReactNode;
  width?: number;
  title?: string;
  footer?: React.ReactNode | React.ReactNode[];
  onOk?: () => void;
  onCancel?: () => void;
  disabledButtonOk?: boolean;
}

const ModalComponent = memo(
  ({
    children,
    title,
    onCancel,
    footer,
    onOk,
    disabledButtonOk = false,
    ...props
  }: ModalComponentInterface) => {
    const computedFooter = useMemo(
      () =>
        footer ?? [
          <ButtonComponent
            onClick={onCancel}
            variant="solid"
            color="danger"
            key={'cancel'}
          >
            {t('Cancel')}
          </ButtonComponent>,
          <ButtonComponent
            key={'confirm'}
            onClick={onOk}
            type="primary"
            disabled={disabledButtonOk}
          >
            {t('Confirm')}
          </ButtonComponent>,
        ],
      [footer, onCancel, onOk, disabledButtonOk]
    );

    return (
      <ConfigProvider
        modal={{
          closable: false,
          styles: {
            content: {
              padding: 0,
            },
            body: {
              padding: '0px 30px',
            },
            footer: {
              padding: '15px 30px',
            },
          },
        }}
      >
        <Modal
          onCancel={onCancel}
          className="!rounded-lg"
          title={
            <div className="flex justify-between items-center py-3 px-5 !rounded-lg">
              <Typography.Title
                className="!m-0 !text-white !font-normal !h-fit"
                level={4}
              >
                {title}
              </Typography.Title>
              <div>
                <Button
                  onClick={onCancel}
                  type="primary"
                  shape="circle"
                  className="!shadow-none duration-100"
                  icon={<CgClose />}
                />
              </div>
            </div>
          }
          footer={computedFooter}
          {...props}
        >
          {children}
        </Modal>
      </ConfigProvider>
    );
  }
);

export default ModalComponent;
