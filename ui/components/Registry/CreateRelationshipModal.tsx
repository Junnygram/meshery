import React from 'react';
import Modal from '../shared/Modal/Modal';
import RelationshipFormStepper from '../RelationshipBuilder/RelationshipFormStepper';

const CreateRelationshipModal = ({ isRelationshipModalOpen, setIsRelationshipModalOpen }) => {
  return (
    <Modal
      maxWidth="md"
      open={isRelationshipModalOpen}
      closeModal={() => setIsRelationshipModalOpen(false)}
      title="Create Relationship"
      style={{
        zIndex: 1500,
      }}
    >
      <RelationshipFormStepper handleClose={() => setIsRelationshipModalOpen(false)} />
    </Modal>
  );
};

export default CreateRelationshipModal;
