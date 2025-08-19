// composables/useDecryption.ts

export const useDecryption = () => {
  const decryptedImage = ref();

  const decryptImage = async (imageUrl: string) => {
    if (process.client && window.decryptImage && imageUrl) {
      try {
        decryptedImage.value = await window.decryptImage(
          `https://pic.rfstl.cn${imageUrl}`
        );
        return decryptedImage.value; // Return the decrypted image URL
      } catch (e) {
        console.error("Decryption failed:", e);
      }
    }
  };

  return { decryptedImage, decryptImage };
};
