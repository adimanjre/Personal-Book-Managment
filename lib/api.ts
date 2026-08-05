import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 5000,
});

export const get = (url: string, config: AxiosRequestConfig) =>
  instance.get(url, config);
export const post = (
  url: string,
  body: unknown,
  config: AxiosRequestConfig,
) => {
  console.log("body ", body);
  return instance.post(url, body, config);
};
export const put = (
  url: string,
  body: unknown,
  config: AxiosRequestConfig,
) => instance.put(url, body, config);
