import axiosClient from "./axiosClient";

const documentApi = {
    getAll() {
        return axiosClient.get("/documents");
    },
    upload(file) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    download(objectKey) {
        return axiosClient.get("/documents/download", {
            params: { filePath: objectKey },
            responseType: "blob"
        });
    },
    delete(id) {
        return axiosClient.delete(`/documents/${id}`);
    }
};

export default documentApi;
