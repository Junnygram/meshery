import React from 'react';
import Modal from '../shared/Modal/Modal';
import ConnectionIcon from '@/assets/icons/Connection';
import ConnectionTable from '../../connections/ConnectionTable';
import { Box } from '@sistent/sistent';

const ConnectionFormModal = ({
  isOpenModal,
  setIsOpenModal,
  meshsyncControllerState,
  connectionMetadataState,
}) => {
  return (
    <Modal
      open={isOpenModal}
      closeModal={() => setIsOpenModal(false)}
      headerIcon={<ConnectionIcon height={24} width={24} />}
      title="Connections"
      maxWidth="xl"
    >
      <Box sx={{ marginBlock: 2, maxHeight: '65vh' }}>
        <ConnectionTable
          meshsyncControllerState={meshsyncControllerState}
          connectionMetadataState={connectionMetadataState}
          selectedFilter={'kubernetes'}
        />
      </Box>
    </Modal>
  );
};

export default ConnectionFormModal;
