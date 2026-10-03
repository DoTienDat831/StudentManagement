import axiosClient from "./axiosClient";

const subjectApi = {
    getAll() {
        return axiosClient.get("/subjects");
    },

    getById(id) {
        return axiosClient.get(`/subjects/${id}`);
    },

    create(subject) {
        return axiosClient.post("/subjects", subject);
    },

    update(id, subject) {
        return axiosClient.put(`/subjects/${id}`, subject);
    },

    delete(id) {
        return axiosClient.delete(`/subjects/${id}`);
    }
};

export default subjectApi;