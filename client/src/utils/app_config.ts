const CONFIG = {
  MAX_IMG_SIZE: 5 * 1024 * 1024,
  SERVER_URL:
    import.meta.env.VITE_SERVER_ENDPOINT?.trim() || "http://localhost:1123",
  IMAGE_ACCEPT_MIMES: ["image/png", "image/jpeg"],
};
export default CONFIG;
