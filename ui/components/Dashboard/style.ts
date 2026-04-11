// @ts-nocheck
import { Typography, Paper, styled, Tab, Tabs, gray, charcoal, Card } from '@sistent/sistent';

const getGlassmorphismStyles = (theme) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(2.5),
  borderRadius: '16px',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
});

export const DashboardSection = styled(Card)(({ theme }) => ({
  ...getGlassmorphismStyles(theme),
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.25)',
  },
}));

export const ChartSectionWithColumn = styled('div')(({ theme }) => ({
  ...getGlassmorphismStyles(theme),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const LoadingContainer = styled('div')({
  height: '17rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '2.5rem',
});

export const LegendSection = styled('div')({
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap',
});
export const ConnectClusterWrapper = styled('div')({
  padding: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

export const ConnectClusterText = styled(Typography)({
  marginBottom: '0.5rem',
});

export const HoneycombRoot = styled(Card)(({ theme, isEditMode }) => ({
  ...getGlassmorphismStyles(theme),
  width: '100%',
  height: isEditMode ? '20rem' : '25rem',
  overflowY: 'auto',
}));

export const HoneycombCell = styled('li')(({ row, column }) => ({
  gridRow: `${row} / span 4`,
  gridColumn: `${column} / span 4`,
  position: 'relative',
  pointerEvents: 'none',
  transform: row % 2 ? 'translateX(24%)' : 'translateX(-26%)',
}));

export const HoneycombContainer = styled('ul')(({ columnSize, columns, rowSize }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns * 4}, ${columnSize}px)`,
  justifyContent: 'center',
  gridAutoRows: `${rowSize}px`,
  padding: `0 ${columnSize}px`,
  listStyle: 'none',
}));

export const HexagonWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#363636' : '#e9eff1', // TODO: this is the honeycomb color add this token in sistent
  position: 'absolute',
  inset: '3.5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  pointerEvents: 'auto',
  boxSizing: 'border-box',
}));

export const IconWrapper = styled('div')({
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
});

export const ResourceCount = styled(Typography)({
  margin: '0px auto',
});

export const SelectedHexagon = styled('div')({
  display: 'flex',
  height: '95%',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
  },
});

export const SkeletonHexagon = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '95%',
  backgroundColor: theme.palette.mode === 'dark' ? '#363636' : '#e9eff1', // TODO: this is the honeycomb color add this token in sistent
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0.5,
}));

export const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  marginTop: '1rem',
  borderRadius: 4,
}));

export const WrapperPaper = styled(Paper)({
  flexGrow: 1,
  height: 'auto',
});

export const HeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'stretch',
    width: '100%',
  },
}));

export const ControlsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  [theme.breakpoints.down('sm')]: {
    alignSelf: 'flex-end',
  },
}));

export const NoResourcesText = styled(Typography)({
  textAlign: 'center',
  marginTop: '2rem',
});

export const SecondaryTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? gray[20] : charcoal[90],
  },
}));

export const SecondaryTabs = styled(Tabs)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? gray[20] : charcoal[90],
}));
