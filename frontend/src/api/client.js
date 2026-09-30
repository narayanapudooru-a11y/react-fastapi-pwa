import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});


let refreshing = false;

let waitingRequests = [];


function processQueue(error) {

  waitingRequests.forEach(
    promise => {

      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }

    }
  );

  waitingRequests = [];
}


api.interceptors.response.use(

  response => response,

  async error => {

    const originalRequest =
      error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes(
        "/auth/login"
      ) ||
      originalRequest.url.includes(
        "/auth/refresh"
      )
    ) {

      return Promise.reject(error);

    }


    if (refreshing) {

      return new Promise(
        (resolve, reject) => {

          waitingRequests.push({
            resolve,
            reject
          });

        }
      ).then(() => {

        return api(originalRequest);

      });

    }


    originalRequest._retry = true;

    refreshing = true;


    try {

      await api.post(
        "/auth/refresh"
      );

      processQueue(null);

      return api(originalRequest);

    } catch (refreshError) {

      processQueue(refreshError);

      window.location.href =
        "/login";

      return Promise.reject(
        refreshError
      );

    } finally {

      refreshing = false;

    }

  }

);


export default api;