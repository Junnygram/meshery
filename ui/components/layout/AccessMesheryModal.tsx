import React from 'react';
import {
  Typography,
  Button,
  styled,
} from '@sistent/sistent';
import Modal from '../shared/Modal/Modal';

const ImgWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
});

const InsideImgWrapper = styled('img')(({ theme }) => ({
  padding: '0rem 0.5rem',
  content:
    theme.palette.mode === 'dark'
      ? "url('/static/img/meshery-logo-text.svg')"
      : "url('/static/img/meshery-logo-light-text.svg')",
}));

const InsideImgWrapperLogo = styled('img')({
  padding: '0rem 0.5rem',
});

const InstallButton = styled(Button)({
  marginBottom: '1rem',
});

export default function AccessMesheryModal(props) {
  const { isOpen, closeForm } = props;
  const handlePage = (e) => {
    window.open('https://meshery.io/#getting-started', '_blank');
    e.stopPropagation();
  };

  return (
    <Modal
      open={isOpen}
      closeModal={closeForm}
      title="The Cloud Native Playground"
      maxWidth="sm"
      footer={
        <InstallButton size="large" variant="contained" color="primary" onClick={handlePage}>
          Install Meshery
        </InstallButton>
      }
    >
      <ImgWrapper>
        <InsideImgWrapperLogo width="20%" height="20%" src="/static/img/meshery-logo.png" />
        <InsideImgWrapper width="50%" height="50%" />
      </ImgWrapper>
      <Typography gutterBottom>
        Meshery Playground gives you hands-on experience with designing cloud native systems -
        from your browser - using every CNCF project. Choose a{' '}
        <a href="https://docs.meshery.io/guides/tutorials" style={{ color: '#00b39f' }}>
          Learning Path
        </a>{' '}
        and work through labs as you visually and collaboratively learn-by-doing without having
        to install a single thing.
      </Typography>
      <Typography gutterBottom>
        To ensure that Meshery Playground remains a clean sandbox for all to use, many of
        Meshery&apos;s features are disabled. For full access to all of Meshery&apos;s features,
        deploy your own instance of Meshery.
      </Typography>
    </Modal>
  );
}
