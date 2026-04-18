import React, { useState } from 'react';
import type { Theme } from '@sistent/sistent';
import {
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Link,
  Avatar,
  useTheme,
  DeleteIcon,
  Box,
} from '@sistent/sistent';
import Fullscreen from '@mui/icons-material/Fullscreen';
import Save from '@mui/icons-material/Save';
import Moment from 'react-moment';
import { UnControlled as CodeMirror } from '../CodeMirror';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import {
  CatalogCardButtons,
  UpdateDeleteButtons,
  GridBtnText,
  GridCloneBtnText,
  CardHeaderRight,
  StyledCodeMirrorWrapper,
} from '../MesheryPatterns/Cards.styles';
import ResourceCard from '../shared/Card/ResourceCard';
import YAMLDialog from '../shared/Modal/YamlDialog';
import CloneIcon from '../../public/static/img/CloneIcon';
import PublicIcon from '@mui/icons-material/Public';
import TooltipButton from '../../utils/TooltipButton';
import { VISIBILITY } from '../../utils/Enum';
import GetAppIcon from '@mui/icons-material/GetApp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useGetUserByIdQuery } from '../../rtk-query/user';
import { MESHERY_CLOUD_PROD } from '../../constants/endpoints';
import { keys } from '@/utils/permission_constants';
import CAN from '@/utils/can';
import { VisibilityChipMenu } from '@sistent/sistent';
import { VIEW_VISIBILITY } from '@/components/shared/Modal/InfoModal';
import { Public, Lock } from '@mui/icons-material';
import { iconMedium } from '@/css/icons.styles';

const INITIAL_GRID_SIZE = { xl: 4, md: 6, xs: 12 };

type FilterDescription = Record<string, string>;

type FiltersCardProps = {
  name: string;
  updated_at?: string;
  created_at?: string;
  filter_resource: string;
  handleClone: (_ev: React.MouseEvent) => void;
  handleDownload: (_ev: React.MouseEvent) => void;
  deleteHandler: () => void;
  setYaml: (_value: string) => void;
  description?: FilterDescription;
  visibility: string;
  handlePublishModal: (_ev: React.MouseEvent) => void;
  handleUnpublishModal: (_ev: React.MouseEvent) => void;
  updateHandler: () => void;
  canPublishFilter?: boolean;
  handleInfoModal: (_ev: React.MouseEvent) => void;
  ownerId?: string;
};

function FiltersCard_({
  name,
  updated_at,
  created_at,
  filter_resource,
  handleClone,
  handleDownload,
  deleteHandler,
  setYaml,
  description = {},
  visibility,
  handlePublishModal,
  handleUnpublishModal,
  updateHandler,
  canPublishFilter = false,
  handleInfoModal,
  ownerId,
}: FiltersCardProps) {
  const genericClickHandler = (ev: React.MouseEvent, fn: (_event: React.MouseEvent) => void) => {
    ev.stopPropagation();
    fn(ev);
  };
  const [gridProps, setGridProps] = useState(INITIAL_GRID_SIZE);
  const [fullScreen, setFullScreen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const { data: owner } = useGetUserByIdQuery(ownerId || '');

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const catalogContentKeys = Object.keys(description);
  const catalogContentValues = Object.values(description);
  const theme = useTheme<Theme>();

  return (
    <>
      {fullScreen && (
        <YAMLDialog
          fullScreen={fullScreen}
          name={name}
          toggleFullScreen={toggleFullScreen}
          config_file={filter_resource}
          setYaml={setYaml}
          deleteHandler={deleteHandler}
          updateHandler={updateHandler}
        />
      )}
      <ResourceCard
        title={name}
        isFlippable={true}
        onFlip={() => {
          setGridProps(INITIAL_GRID_SIZE);
          setShowCode(true); // Ensure code is shown when flipped
        }}
        headerRight={
          <div>
            <VisibilityChipMenu
              value={visibility}
              onChange={() => {}}
              enabled={false}
              options={[
                [VIEW_VISIBILITY.PUBLIC, Public],
                [VIEW_VISIBILITY.PRIVATE, Lock],
              ]}
            />
          </div>
        }
        subtitle={
          updated_at ? (
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Modified On: <Moment format="LLL">{updated_at}</Moment>
            </Typography>
          ) : null
        }
        footer={
          <CatalogCardButtons>
            {canPublishFilter && visibility !== VISIBILITY.PUBLISHED ? (
              <TooltipButton
                variant="outlined"
                title="Publish"
                sx={{
                  padding: '6px 9px',
                  borderRadius: '8px',
                }}
                onClick={(ev) => genericClickHandler(ev, handlePublishModal)}
                disabled={!CAN(keys.PUBLISH_WASM_FILTER.action, keys.PUBLISH_WASM_FILTER.subject)}
              >
                <PublicIcon style={iconMedium} />
                <> Publish </>
              </TooltipButton>
            ) : (
              <TooltipButton
                variant="outlined"
                title="Unpublish"
                sx={{
                  padding: '6px 9px',
                  borderRadius: '8px',
                }}
                onClick={(ev) => genericClickHandler(ev, handleUnpublishModal)}
                disabled={
                  !CAN(keys.UNPUBLISH_WASM_FILTER.action, keys.UNPUBLISH_WASM_FILTER.subject)
                }
              >
                <PublicIcon style={iconMedium} />
                <GridBtnText> Unpublish </GridBtnText>
              </TooltipButton>
            )}
            <TooltipButton
              title="Download"
              variant="contained"
              color="primary"
              onClick={handleDownload}
              sx={{
                padding: '6px 9px',
                borderRadius: '8px',
              }}
              disabled={
                !CAN(keys.DOWNLOAD_A_WASM_FILTER.action, keys.DOWNLOAD_A_WASM_FILTER.subject)
              }
            >
              <GetAppIcon fill="#fff" style={iconMedium} />
              <GridBtnText>Download</GridBtnText>
            </TooltipButton>

            {visibility === VISIBILITY.PUBLISHED ? (
              <TooltipButton
                title="Clone"
                variant="contained"
                color="primary"
                sx={{
                  padding: '6px 9px',
                  borderRadius: '8px',
                }}
                onClick={(ev) => genericClickHandler(ev, handleClone)}
                disabled={!CAN(keys.CLONE_WASM_FILTER.action, keys.CLONE_WASM_FILTER.subject)}
              >
                <CloneIcon fill="#fff" style={iconMedium} />
                <GridCloneBtnText>Clone</GridCloneBtnText>
              </TooltipButton>
            ) : null}
            <TooltipButton
              title="Filter Information"
              variant="contained"
              color="primary"
              onClick={(ev) => genericClickHandler(ev, handleInfoModal)}
              sx={{
                padding: '6px 9px',
                borderRadius: '8px',
              }}
              disabled={
                !CAN(keys.DETAILS_OF_WASM_FILTER.action, keys.DETAILS_OF_WASM_FILTER.subject)
              }
            >
              <InfoOutlinedIcon fill="#fff" style={iconMedium} />
              <GridBtnText> Info </GridBtnText>
            </TooltipButton>
          </CatalogCardButtons>
        }
        backHeaderRight={
          <CardHeaderRight>
            <Link href={`${MESHERY_CLOUD_PROD}/user/${ownerId}`} target="_blank">
              <Avatar alt="profile-avatar" src={owner?.avatar_url} />
            </Link>
            <Tooltip title="Enter Fullscreen" arrow interactive placement="top">
              <IconButton
                onClick={(ev) =>
                  genericClickHandler(ev, () => {
                    toggleFullScreen();
                  })
                }
              >
                {fullScreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </CardHeaderRight>
        }
        backSubtitle={
          created_at ? (
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Created at: <Moment format="LLL">{created_at}</Moment>
            </Typography>
          ) : null
        }
        backFooter={
          <UpdateDeleteButtons>
            <Tooltip title="Save" arrow interactive placement="bottom">
              <IconButton
                disabled={!CAN(keys.EDIT_WASM_FILTER.action, keys.EDIT_WASM_FILTER.subject)}
                onClick={(ev) => genericClickHandler(ev, updateHandler)}
              >
                <Save fill="#fff" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" arrow interactive placement="bottom">
              <IconButton
                disabled={!CAN(keys.DELETE_WASM_FILTER.action, keys.DELETE_WASM_FILTER.subject)}
                onClick={(ev) => genericClickHandler(ev, deleteHandler)}
              >
                <DeleteIcon fill="#fff" />
              </IconButton>
            </Tooltip>
          </UpdateDeleteButtons>
        }
        backContent={
          <Box
            sx={{ flexGrow: 1 }}
            onClick={(ev) => genericClickHandler(ev, () => {})}
            data-testid="filter-card-back"
          >
            <Divider sx={{ mb: 1 }} light />

            {catalogContentKeys.length === 0 ? (
              <StyledCodeMirrorWrapper fullScreen={fullScreen}>
                <CodeMirror
                  value={showCode && filter_resource}
                  options={{
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true,
                    gutters: ['CodeMirror-lint-markers'],
                    lint: true,
                    mode: 'text/x-yaml',
                  }}
                  onChange={(_, data, val) => setYaml(val)}
                />
              </StyledCodeMirrorWrapper>
            ) : (
              catalogContentKeys.map((title, index) => (
                <Box key={index} mb={1}>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{catalogContentValues[index]}</Typography>
                </Box>
              ))
            )}
          </Box>
        }
      />
    </>
  );
}

export const FiltersCard = (props) => {
  return <FiltersCard_ {...props} />;
};

export default FiltersCard;
