import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | undefined | null = null;
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }
  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | undefined | null) => {
    if (token) localStorage.setItem("jwt", token);
    this.token = token;
  };
  // setToken = async (token: string | undefined | null) => {
  //   if (token) {
  //     localStorage.setItem("jwt", token);
  //   }
  //   await Promise.resolve(); // Asenkron işlem ekleyebilirsiniz.
  //   this.token = token;
  // };
  

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
