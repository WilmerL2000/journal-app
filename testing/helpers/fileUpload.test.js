import { fileUpload } from '../../src/helpers/fileUpload';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'wils09',
  api_key: '582764265798856',
  api_secret: 'xIDVWZqXuqu-lDQ4DGtzSZ66FFM',
  secure: true,
});

describe('Pruebas en fileUpload', () => {
  test('Debe de subir el archivo correctamente a cloudinary', async () => {
    const imgUrl =
      'https://media.istockphoto.com/id/498296158/photo/juneau-alaska.jpg?s=612x612&w=0&k=20&c=73MXWklww8sOUmMOteSg_raQOo7b6DczRNIOiZO2TFs=';
    const resp = await fetch(imgUrl);
    const blob = await resp.blob();
    const file = new File([blob], 'foto.jpg');

    const url = await fileUpload(file);
    expect(typeof url).toBe('string');

    const segments = url.split('/');
    const imageId = segments[segments.length - 1].replace('.jpg', '');

    await cloudinary.api.delete_resources(['journal/' + imageId], {
      resourcetype: 'image',
    });
  });

  test('Debe de retornar null', async () => {
    const file = new File([], 'foto.jpg');

    const url = await fileUpload(file);
    expect(url).toBe(null);
  });
});
