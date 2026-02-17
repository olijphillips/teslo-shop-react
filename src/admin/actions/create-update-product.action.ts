import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";
import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
  productLike: Partial<Product> & { files?: File[] },
): Promise<Product> => {
  await sleep(1500);

  const { id, images = [], files = [], ...rest } = productLike;

  console.log("Datos recibidos:", { id, images, files, rest }); // Debug

  const isCreating = id === "new";

  // Limpiar campos que no deben enviarse al backend
  const { user, createdAt, updatedAt, ...productData } = rest as any;

  productData.stock = Number(productData.stock || 0);
  productData.price = Number(productData.price || 0);

  // Preparar las imagenes
  let imagesToSave = [...images];

  if (files && files.length > 0) {
    const newImageNames = await uploadFiles(files);
    imagesToSave = [...imagesToSave, ...newImageNames];
  }

  // Limpiar las URLs de las imágenes
  imagesToSave = imagesToSave.map((image) => {
    if (image.includes("http")) return image.split("/").pop() || "";
    return image;
  });

  const dataToSend = { ...productData, images: imagesToSave };

  console.log("Datos a enviar:", dataToSend); // Debug

  try {
    const { data } = await tesloApi<Product>({
      url: isCreating ? "/products" : `/products/${id}`,
      method: isCreating ? "POST" : "PATCH",
      data: dataToSend,
    });

    return {
      ...data,
      images: data.images.map((image) => {
        if (image.includes("http")) return image;
        return `${import.meta.env.VITE_URL}/files/products/${image}`;
      }),
    };
  } catch (error: any) {
    console.error("Error en la petición:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};

export interface FileUploadResponse {
  secureUrl: string;
  fileName: string;
}

const uploadFiles = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await tesloApi<FileUploadResponse>({
      url: "/files/product",
      method: "POST",
      data: formData,
    });

    return data.fileName;
  });

  const uploadedFilesNames = await Promise.all(uploadPromises);
  return uploadedFilesNames;
};
