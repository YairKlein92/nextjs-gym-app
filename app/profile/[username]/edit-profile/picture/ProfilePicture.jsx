'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './page.module.scss';

export default function ProfilePicture(props) {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [exampleImg, setExampleImg] = useState('');
  // const [link, setLink] = useState();
  const user = props.user;

  const handleOnChange = (changeEvent) => {
    // React.ChangeEvent<HTMLFormElement>
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === 'file',
    );
    console.log(fileInput);
    const formData = new FormData();
    for (const file of fileInput.files) {
      formData.append('file', file);
    }
    formData.append('upload_preset', 'my-uploads');

    const dataPicture = await fetch(
      'https://api.cloudinary.com/v1_1/dvbgjm0xm/image/upload',
      {
        method: 'PUT',
        body: formData,
      },
    ).then((response) => response.json());

    setImageSrc(dataPicture.secure_url);
    setUploadData(dataPicture);

    const response = await fetch(
      `/api/users/${user.id}/profile/update/profile-picture`,
      {
        method: 'PUT',
        body: JSON.stringify({
          id: user.id,
          profilePicture: dataPicture.secure_url || '/public/profile.png',
        }),
      },
    );
    if (response.ok) {
    } else {
      console.error('Failed to upload profile picture:', response.status);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.adviceDiv}>
        After clicking in 'Upload file', you will see the final result that
        would be shown in your profile.
        <div className={styles.adviceDiv}>
          {' '}
          If you don't like it, you can upload another picture. If you want the
          best result, try choosing a square picture.
          <img src={exampleImg} alt="" />
        </div>{' '}
      </div>
      <div>
        <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          {/* <label htmlFor="picture">Let's start it!</label>{' '} */}
          <div>
            <input id="picture" type="file" name="file" />
          </div>
          {/* <img src={imageSrc} alt="Profile picture" /> */}
          {imageSrc && !uploadData && (
            <div>
              <button>Upload picture</button>
            </div>
          )}
          {uploadData && (
            <div>
              <img
                className={styles.img}
                src={imageSrc}
                alt="The result you would see in your profile"
                height={240}
                width={240}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
