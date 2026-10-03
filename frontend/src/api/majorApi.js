import axiosClient from "./axiosClient";

const majorApi = {
    getAll() {
        return axiosClient.get("/majors");
    },

    getById(id) {
        return axiosClient.get(`/majors/${id}`);
    },

    create(major) {
        return axiosClient.post("/majors", major);
    },

    update(id, major) {
        return axiosClient.put(`/majors/${id}`, major);
    },

    delete(id) {
        return axiosClient.delete(`/majors/${id}`);
    }
};

export default majorApi;