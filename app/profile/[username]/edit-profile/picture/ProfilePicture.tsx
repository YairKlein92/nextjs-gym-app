'use client';
import { useRouter } from 'next/router';
import react, { useState } from 'react';

export type User = {
  id: number;
  passwordHash: string;
  username: string;
  mail: string;
  age: number;
  mobile: string;
  isShredding: boolean;
  isBulking: boolean;
  isExperienced: boolean;
};
export type Props = {
  user: User;
};

export default function ProfilePicture(props: Props) {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  console.log(props.user);
  const handleOnChange = (changeEvent: React.ChangeEvent<HTMLFormElement>) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };
  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const data = await fetch(
      'https://api.cloudinary.com/v1_1/dvbgjm0xm/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((response) => response.json());
    setImageSrc(data.secure_url);
    setUploadData(data);

    console.log('data', data);
  };

  return (
    <>
      <div>Hello World</div>
      <div>
        <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <label htmlFor="picture">Profile picture</label>{' '}
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
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
            </code>
          )}
        </form>
      </div>
    </>
  );
}
