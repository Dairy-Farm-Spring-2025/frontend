import React, { memo, useEffect, useMemo, useState } from 'react';
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
    const [viewportHeight, setViewportHeight] = useState<number>(
      window.innerHeight
    );

    useEffect(() => {
      const handleResize = () => {
        setViewportHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

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
              overflowY: 'auto',
              maxHeight: viewportHeight * 0.7, // Chiều cao body modal tối đa là 70% màn hình
            },
            footer: {
              padding: '15px 30px',
            },
            wrapper: {
              height: viewportHeight, // Thay đổi theo kích thước màn hình
            },
          },
        }}
      >
        <Modal
          onClose={onCancel}
          className="!rounded-lg"
          style={{ top: viewportHeight * 0.02 }}
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
