import React from 'react';
import Modal from '../shared/Modal/Modal';
import CustomizedSteppers from './Stepper';

import { useCancelConnectionRegisterMutation } from '@/rtk-query/connection';
import { useDeleteMeshsyncResourceMutation } from '@/rtk-query/meshsync';
import { useNotification } from '@/utils/hooks/useNotification';
import { EVENT_TYPES } from 'lib/event-types';

const RegisterConnectionModal = ({
  openRegistrationModal,
  connectionData,
  handleRegistrationModalClose,
}) => {
  const [sharedData, setSharedData] = React.useState(null);
  const { notify } = useNotification();
  const [cancelConnection] = useCancelConnectionRegisterMutation();
  const [deleteMeshsyncResource] = useDeleteMeshsyncResourceMutation();

  const cancelConnectionRegister = (id) => {
    cancelConnection({ body: JSON.stringify({ id }) })
      .unwrap()
      .then(() => {
        notify({
          message: 'Connection registration cancelled.',
          event_type: EVENT_TYPES.INFO,
        });
      });
  };
  const handleClose = () => {
    handleRegistrationModalClose();
    if (sharedData?.connection?.id) {
       cancelConnectionRegister(sharedData.connection.id);
    }
  };

  const handleRegistrationComplete = (resourceId) => {
    deleteMeshsyncResource({ resourceId: resourceId })
      .unwrap()
      .then(() => {
        notify({
          message: 'Connection registered!',
          event_type: EVENT_TYPES.SUCCESS,
        });
      })
      .catch((error) => {
        notify({
          message: `Failed to register connection: ${error}`,
          event_type: EVENT_TYPES.ERROR,
        });
      });
  };

  return (
    <Modal
      open={openRegistrationModal}
      closeModal={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      title="Register Connection"
    >
      <CustomizedSteppers
        onClose={handleClose}
        connectionData={connectionData}
        sharedData={sharedData}
        setSharedData={setSharedData}
        handleRegistrationComplete={handleRegistrationComplete}
      />
    </Modal>
  );
};

export default RegisterConnectionModal;
