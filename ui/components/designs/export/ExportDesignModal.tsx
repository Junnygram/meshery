import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Box,
  IconButton,
  Typography,
} from '@sistent/sistent';
import Modal from '../../shared/Modal/Modal';
import { Download, InfoOutlined } from '../../icons';
import KubernetesIcon from '@/assets/icons/technology/kubernetes';
import PatternIcon from '@/assets/icons/Pattern';
import { OCIImageIcon } from '@/assets/icons/OciImage';
import HelmIcon from '@/assets/icons/technology/HelmIcon';
import { Colors } from '@/themes/app';

const ExportOption = ({
  title,
  Icon,
  onClick,
  content,
  disabled = false,
  description = 'Download the design in the selected format',
}) => {
  const theme = useTheme();
  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        borderRadius: '0.25rem',
        opacity: disabled ? 0.5 : 1,
        marginBottom: '1rem',
        border: `1px solid ${theme.palette.border.normal}`,
        boxShadow: theme.shadows[1],
        cursor: disabled ? 'not-allowed' : 'default',
        '&:hover': {
          borderColor: theme.palette.border.brand,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: theme.spacing(1),
          justifyContent: 'space-between',
        }}
      >
        <ListItemIcon style={{ minWidth: '2rem', marginRight: '1rem' }}>{Icon}</ListItemIcon>
        <ListItemText primary={title} />
        <IconButton title={description}>
          <InfoOutlined />
        </IconButton>
        <IconButton
          disabled={disabled}
          onClick={onClick}
          sx={{
            marginLeft: '0.5rem',
          }}
        >
          <Download fill={theme.palette.icon.default} />
        </IconButton>
      </Box>
      {content}
    </ListItem>
  );
};

const ExportDesignModal = (props) => {
  const {
    downloadModal,
    handleDownloadDialogClose,
    handleDesignDownload,
    extensionExportOptions = [],
  } = props;

  const ExportOptions = [
    {
      title: 'Meshery Design (yaml)',
      icon: <PatternIcon width={'30'} height="30" fill={Colors.caribbeanGreen} />,
      onClick: (e) => handleDesignDownload(e, downloadModal.content),
      description:
        'Export your design as a complete, self-contained Meshery Design file (YAML). This file includes embedded images and all configuration details. It\'s the perfect format for creating backups, sharing with colleagues using Meshery, or transferring designs between Meshery environments without losing any information (lossless transfer).',
    },
    {
      title: 'Meshery Design (OCI image)',
      icon: <OCIImageIcon width={'30'} height="30" />,
      onClick: (e) => handleDesignDownload(e, downloadModal.content, null, 'oci=true'),
      description:
        'Download your design as an OCI compatible container image, which can be pushed to and pulled from container registries like Docker Hub, AWS ECR, and so on.',
    },
    {
      title: 'Kubernetes Manifest (yaml)',
      icon: <KubernetesIcon width={'30'} height="30" />,
      onClick: (e) =>
        handleDesignDownload(e, downloadModal.content, null, 'export=Kubernetes Manifest'),
      description:
        'Download your design as a standard Kubernetes Manifest file. This process strips out Meshery-specific information.',
    },
    {
      title: 'Helm Chart (tar.gz)',
      icon: <HelmIcon width={'30'} height="30" />,
      onClick: (e) => handleDesignDownload(e, downloadModal.content, null, 'export=helm-chart'),
      disabled: false,
      description: 'Download your design as a Helm Chart. This process strips out Meshery-specific information.',
    },
    ...extensionExportOptions,
  ];

  return (
    <Modal
      open={downloadModal.open}
      closeModal={handleDownloadDialogClose}
      title="Export Design as..."
      headerIcon={<PatternIcon fill={'#fff'} height={'2rem'} width="2rem" />}
    >
      <Box sx={{ padding: 1 }}>
        {ExportOptions.map((option) => (
          <ExportOption
            key={option.title}
            title={option.title}
            Icon={option.icon}
            content={option.content}
            disabled={option.disabled}
            description={option.description}
            onClick={(e) => option.onClick(e)}
          />
        ))}
      </Box>
    </Modal>
  );
};

export default ExportDesignModal;
