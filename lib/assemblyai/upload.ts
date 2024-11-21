

const cloudName = `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

const uploadPreset = `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`;

export const uploadAudioToCloudinary = async (audioBlob: Blob | File) => {
  const formData = new FormData();
  formData.append("file", audioBlob);
  formData.append("upload_preset", uploadPreset); // Set up an unsigned preset in Cloudinary

  // Additional Cloudinary options (e.g., transformations)

  // const defaultOptions = {
  //   resource_type: "video", // Required for audio files
  //   format: "mp3", // Convert to mp3
  // };


  try {
    // Make a POST request to upload the audio
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if (result.secure_url) {
      return result.secure_url; // Cloudinary URL for the uploaded audio
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.error("Error during uploading audio!:", error);
    throw new Error("Failed to upload audio");
  }
};

