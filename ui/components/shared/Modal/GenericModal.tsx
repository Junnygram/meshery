import React from 'react';
import { Modal, Backdrop, Box, styled, Fade } from '@sistent/sistent';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledFade = styled(Fade)({
  maxHeight: '90vh',
  overflow: 'auto',
});

/**
 * GenericModal provides a basic modal wrapper with a centered container and fade transition.
 */
const GenericModal = ({ open, Content, handleClose, container }) => {
  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 200 } }}
      container={container}
      maxWidth="lg"
    >
      <Fade in={open}>
        <Box sx={{ outline: 'none', width: '100%' }}>{Content}</Box>
      </Fade>
    </StyledModal>
  );
};

export default GenericModal;
