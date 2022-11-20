import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Button } from "@mantine/core";
import GetCroppedImage from "./CroppedImage";
interface Props {
  src: string;
  type: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  modalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageCropper(props: Props) {
  const { src, type, setFile, modalClose } = props;
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImageSrc, setCroppedImageSrc] = useState<string>();
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const CropImage = useCallback(
    async function () {
      try {
        const croppedImage = await GetCroppedImage({
          imageSrc: src,
          imageType: type,
          pixelCrop: croppedAreaPixels!,
        });
        setCroppedImageSrc(URL.createObjectURL(croppedImage));
        setFile(croppedImage);
        modalClose(false);
      } catch (error) {
        console.error(error);
      }
    },
    [croppedAreaPixels]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "500px",
          bottom: "10px",
          position: "relative",
          marginBottom: "4px",
        }}
      >
        <Cropper
          image={src}
          crop={crop}
          cropShape="round"
          cropSize={{ width: 250, height: 250 }}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </div>
      <div
        style={{
          isolation: "isolate",
        }}
      >
        <Button onClick={CropImage} fullWidth>
          Crop
        </Button>
      </div>
    </div>
  );
}
