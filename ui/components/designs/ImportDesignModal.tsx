import React from 'react';
import Modal from '../shared/Modal/Modal';
import { RJSFModalWrapper } from '../shared/Modal/RJSFModalWrapper';
import { capitalize } from 'lodash';

// might also expect RJSFWrapperComponent from extensions
export default function ImportDesignModal(props) {
  const { importType, handleSubmit, handleClose, rjsfSchema, uiSchema } = props;

  return (
    <Modal open={props.open} closeModal={handleClose} title={`Import ${capitalize(importType)}`}>
      <RJSFModalWrapper
        schema={rjsfSchema}
        uiSchema={uiSchema || {}}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        submitBtnText={`Import ${capitalize(importType)}`}
      />
    </Modal>
  );
}
