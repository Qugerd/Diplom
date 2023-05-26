import base64


PLACEHOLD_PATH = "http://placehold.it/150x150"
TITLE = ''
ID = ''

def Image_to_Bytes(image_path):
    print(image_path)
    if image_path != PLACEHOLD_PATH:
        with open(image_path, 'rb') as f:
            picture = f.read()
            return picture

    return image_path


def Blob_to_base64(image_blob):
    if image_blob != PLACEHOLD_PATH:
        image_base64 = base64.b64encode(image_blob).decode('ascii')
        return image_base64

    return image_blob

        # im = Image.open(BytesIO(image_blob))
        # # print(im)
        # buffer = BytesIO()
        # im.save(buffer, format="JPEG")
        # im_b64 = base64.b64encode(buffer.getvalue()).decode()
        # # im.save(f"{image_name}.png", "PNG")
        
def convert_str_to_numeric(str):
    lat, log = str
    lat, log = float(lat.replace(',', '.')), float(log.replace(',', '.'))
    return lat, log