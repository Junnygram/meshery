import React from 'react';
import Modal, { ModalProps } from './Modal';
import { ModalBody, ModalFooter, ModalButtonPrimary, Typography, RenderMarkdown } from '@sistent/sistent';

interface InfoModalProps extends Omit<ModalProps, 'children'> {
  content: string;
  isMarkdown?: boolean;
}

/**
 * Standardized InfoModal component for displaying information/markdown.
 */
const InfoModal: React.FC<InfoModalProps> = ({ content, isMarkdown = true, closeModal, ...props }) => {
  return (
    <Modal {...props} closeModal={closeModal}>
      <ModalBody>
        {isMarkdown ? (
          <RenderMarkdown>{content}</RenderMarkdown>
        ) : (
          <Typography variant="body1">{content}</Typography>
        )}
      </ModalBody>
      <ModalFooter>
        <ModalButtonPrimary onClick={closeModal}>Close</ModalButtonPrimary>
      </ModalFooter>
    </Modal>
  );
};

export default InfoModal;
