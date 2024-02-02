import React, { useEffect, useRef } from "react";

import axios from "axios";
import { ErrorResponseType } from "@@types/response-types";
import QueryString from "qs";

// export type paramType = {
//   key: string;
//   value?: string | number;
// };

type ApiUtilParamsType = {
  // method: "get" | "post" | "put" | "delete";
  params?: { [key: string]: any };
  url: string;
};

// const API_END_POINT = "https://localhost:3000";
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
const request = axios.create({
  withCredentials: true,
  baseURL: API_END_POINT,
});

const requestApi = async <T>(method: "get" | "post" | "put" | "delete", options: ApiUtilParamsType, accessToken?: string): Promise<T> => {
  try {
    const { params, url } = options;
    if (method === "get") {
      return await get<T>({ params, url }, accessToken);
    } else if (method === "post") {
      return await post<T>({ params, url }, accessToken);
    } else if (method === "put") {
      return await put<T>({ params, url }, accessToken);
    } else if (method === "delete") {
      return await del<T>({ params: params, url: url }, accessToken);
    } else {
      throw new Error("");
    }
  } catch (err) {
    if (axios.isAxiosError<ErrorResponseType>(err)) {
      const error: ErrorResponseType = {
        message: err.response?.data.message || "",
        time: err.response?.data.time,
        statusCode: err.response?.status || 400,
      };

      throw error;
    }
    const otherError: ErrorResponseType = {
      message: "클라이언트에 문제가 발생했습니다.",
      time: new Date(),
      errorCode: "000000",
      statusCode: 200,
    };

    throw otherError;
  }
};
const get = async <T>({ params, url }: ApiUtilParamsType, accessToken?: string): Promise<T> => {
  let queryStr = "";

  // const [accessToken] = useAccessToken();

  if (params) {
    Object.keys(params).map((key) => {
      queryStr += `${key}=${params[key]}&`;
    });
  }
  // 끝이 &로 끝나면 마지막 글자 제거.
  if (queryStr.endsWith("&")) {
    queryStr = queryStr.slice(0, -1);
  }
  const result = await request.get(`${API_END_POINT}${url}`, {
    headers: {
      Authorization: accessToken && `Bearer ${accessToken}`,
    },
    params,
    paramsSerializer: (p) => QueryString.stringify(p),
  });

  return result.data;
};

const post = async <T>({ params, url }: ApiUtilParamsType, accessToken?: string): Promise<T> => {
  // axios.post(`${API_END_POINT}${url?}`)
  const result = await request.post<T>(`${API_END_POINT}${url}`, params, {
    headers: {
      Authorization: `${accessToken ? `Bearer ${accessToken}` : ``}`,
    },
  });

  const { data } = result;

  return data;
};

const put = async <T>({ params, url }: ApiUtilParamsType, accessToken?: string): Promise<T> => {
  // axios.post(`${API_END_POINT}${url?}`)
  const result = await request.put<T>(`${API_END_POINT}${url}`, params, {
    headers: {
      Authorization: `${accessToken ? `Bearer ${accessToken}` : ``}`,
    },
  });

  const { data } = result;

  return data;
};

const del = async <T>({ params, url }: ApiUtilParamsType, accessToken?: string): Promise<T> => {
  // axios.post(`${API_END_POINT}${url?}`)
  const result = await request.delete<T>(`${API_END_POINT}${url}`, {
    headers: {
      Authorization: `${accessToken ? `Bearer ${accessToken}` : ``}`,
    },
    params,
  });

  const { data } = result;

  return data;
};

const fileUpload = async (url: string, type: string, formdata: FormData, onProgress?: (progress: number) => void) => {
  return axios.post(url, formdata, {
    headers: {
      "Content-Type": type,
    },
    onUploadProgress: (e) => {
      onProgress && onProgress(e.progress || 0);
      // setProgress(e.progress || 0);
    },
  });
};
export default { requestApi, fileUpload };
