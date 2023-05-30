import {
  DeleteOutline,
  SaveOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useForm } from '../../hooks';
import {
  setActiveNote,
  startDeletingNote,
  startSaveNote,
  startUploadingFiles,
} from '../../store/journal';
import { ImageGallery } from '../components';

export const NoteView = () => {
  const {
    active: note,
    messageSaved,
    isSaving,
  } = useSelector((state) => state.journal);
  const { body, title, date, onInputChange, formState } = useForm(note);
  const dispatch = useDispatch();

  const dateString = useMemo(() => {
    const newDate = new Date(date);
    return new Intl.DateTimeFormat('es-CR', { dateStyle: 'long' }).format(
      newDate
    );
  }, [date]);

  const fileInputRef = useRef();

  useEffect(() => {
    dispatch(setActiveNote(formState));
  }, [formState]);

  /**
   * This function dispatches an action to start saving a note.
   */
  const onSaveNote = () => {
    dispatch(startSaveNote());
  };

  useEffect(() => {
    if (messageSaved.length > 0) {
      Swal.fire('Nota actializada', messageSaved, 'success');
    }
  }, [messageSaved]);

  /**
   * The function takes in a file input change event and dispatches an action to start uploading the
   * selected files.
   * @returns If `target.files` is equal to 0, then nothing is being returned. Otherwise, the
   * `startUploadingFiles` function is being dispatched with `target.files` as its argument.
   */
  const onFileInputChange = ({ target }) => {
    if (target.files === 0) return;
    dispatch(startUploadingFiles(target.files));
  };

  const onDelete = () => {
    dispatch(startDeletingNote());
  };

  return (
    <Grid
      className="animate__animated animate__fadeIn animate__faster"
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Grid item>
        <Typography fontSize={39} fontWeight="light">
          {dateString}
        </Typography>
      </Grid>

      <Grid item>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={onFileInputChange}
          style={{ display: 'none' }}
        />
        <Tooltip title="Subir imágenes" TransitionComponent={Zoom}>
          <IconButton
            color="primary"
            disabled={isSaving}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadOutlined />
          </IconButton>
        </Tooltip>
        <Button
          disabled={isSaving}
          onClick={onSaveNote}
          color="primary"
          sx={{ padding: 2 }}
        >
          <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
          Guardar
        </Button>
      </Grid>

      <Grid container>
        <TextField
          type="text"
          variant="filled"
          fullWidth
          placeholder="Ingrese un título"
          label="Título"
          sx={{ border: 'none', mb: 1 }}
          name="title"
          value={title}
          onChange={onInputChange}
        />
        <TextField
          type="text"
          variant="filled"
          fullWidth
          multiline
          placeholder="¿Qué sucedió en el día de hoy?"
          minRows={5}
          name="body"
          value={body}
          onChange={onInputChange}
        />
      </Grid>
      <Grid container justifyContent="end">
        <Tooltip title="Eliminar nota" TransitionComponent={Zoom}>
          <Button onClick={onDelete} sx={{ mt: 2 }} color="error">
            <DeleteOutline />
          </Button>
        </Tooltip>
      </Grid>
      <ImageGallery images={note.imageUrls} />
    </Grid>
  );
};
