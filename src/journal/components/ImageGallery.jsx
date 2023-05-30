import { ImageList, ImageListItem, useMediaQuery } from '@mui/material';

export const ImageGallery = ({ images = [] }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <ImageList
      sx={{ width: '100%', height: '100%' }}
      cols={isMobile ? 2 : 4}
      rowHeight={200}
    >
      {images.map((image) => (
        <ImageListItem key={image}>
          <img
            src={`${image}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt="Imagen de la nota"
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
