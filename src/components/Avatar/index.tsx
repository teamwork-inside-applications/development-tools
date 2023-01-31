import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AddIcon, EditIcon, RemoveIcon, UploadIcon } from "tdesign-icons-react";
import { useDropzone } from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import "./index.scss";
import { Button, Dialog } from "tdesign-react";

export interface AvatarProps {
  size?: string | number;
  image?: string;
  onImageChange?(canvas: HTMLCanvasElement): void;
}

export const Avatar: FC<AvatarProps> = ({ size, image, onImageChange }) => {
  const avatarEditRef = useRef<AvatarEditor>(null);

  const avatarEditWrapperElement = useRef<HTMLDivElement>(null);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [avatarEditImage, setAvatarEditImage] = useState<File | undefined>(
    undefined
  );
  const [scale, setScale] = useState<number>(1);
  const [disabledSelectImg, setDisabledSelectImg] = useState<boolean>(false);
  const { open, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    multiple: false,
    onDrop(acceptedFiles) {
      setDisabledSelectImg(true);
      setAvatarEditImage(acceptedFiles[0]);
      setScale(1);
    },
    onFileDialogCancel() {
      setDisabledSelectImg(!!avatarEditImage);
    },
    disabled: disabledSelectImg,
  });

  const [showMask, setShowMask] = useState<boolean>(false);

  const avatarMouseEnter = useCallback(() => {
    setShowMask(true);
  }, []);

  const avatarMouseLeave = useCallback(() => {
    setShowMask(false);
  }, []);

  useEffect(() => {
    if (!avatarEditWrapperElement.current) {
      return;
    }

    const wrapperEle = avatarEditWrapperElement.current;

    document.body.appendChild(wrapperEle);
    return () => {
      wrapperEle.remove();
    };
  }, []);

  useEffect(() => {
    if (!disabledSelectImg && avatarEditImage) {
      open();
      setDisabledSelectImg(true);
    }
  }, [disabledSelectImg, avatarEditImage, open]);

  const dialogCancelClick = useCallback(() => {
    setAvatarEditImage(undefined);
    setShowEditDialog(false);
    setDisabledSelectImg(false);
  }, []);

  const dialogConfirmClick = useCallback(() => {
    try {
      if (!avatarEditImage || !avatarEditRef.current) {
        return;
      }

      onImageChange && onImageChange(avatarEditRef.current.getImage());
    } finally {
      dialogCancelClick();
    }
  }, [avatarEditImage, dialogCancelClick, onImageChange]);

  return (
    <div className="avatar-wrapper" style={{ width: size, height: size }}>
      <div
        onMouseEnter={avatarMouseEnter}
        onMouseLeave={avatarMouseLeave}
        className="avatar"
        onClick={() => {
          setShowEditDialog(true);
        }}
      >
        {image && <img src={image} alt="头像" width="100%" height="100%" />}
        <div className={classNames("mask", { show: showMask })}>
          <EditIcon color="#fff" size="23px" />
        </div>
      </div>
      <Dialog
        onCancel={dialogCancelClick}
        onConfirm={dialogConfirmClick}
        closeOnOverlayClick={false}
        header="编辑图标"
        closeBtn={<></>}
        visible={showEditDialog}
        confirmBtn={{ disabled: !avatarEditImage, children: "确认" }}
      >
        <div className="avatar-edit-content">
          <div className="avatar-edit-wrapper">
            <div
              {...getRootProps({
                className: classNames({ dropzone: !avatarEditImage }),
              })}
            >
              {avatarEditImage && (
                <AvatarEditor
                  ref={avatarEditRef}
                  width={180}
                  height={180}
                  border={50}
                  color={[0, 0, 0, 0.3]} // RGBA
                  scale={scale}
                  rotate={0}
                  borderRadius={8}
                  image={avatarEditImage}
                />
              )}
              {!avatarEditImage && <p>在此处拖拽或点击选择头像</p>}
              <input
                {...getInputProps()}
                accept="image/png,image/jpg,image/jpeg,"
              />
            </div>
          </div>
          {avatarEditImage && (
            <div className="operation-btn-group">
              <Button
                onClick={() => {
                  setDisabledSelectImg(false);
                }}
                variant="outline"
                icon={<UploadIcon />}
              >
                重新选择
              </Button>
              <Button
                onClick={() => {
                  setScale((scale) => {
                    return scale + 0.1;
                  });
                }}
                icon={<AddIcon />}
                variant="outline"
              >
                放大
              </Button>
              <Button
                disabled={scale <= 0.1}
                onClick={() => {
                  setScale((scale) => {
                    scale = scale - 0.1;
                    if (scale < 0.1) {
                      return 0.1;
                    }
                    return scale;
                  });
                }}
                icon={<RemoveIcon />}
                variant="outline"
              >
                缩小
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
