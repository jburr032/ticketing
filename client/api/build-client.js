import axios from "axios";

export default ({ req }) => {
  // Making the call from the server if window is undefined
  if (typeof window === "undefined") {
    console.log("Rendered inside the server");
    // Configured axios url to make a call to the nginx-ingress pod within the nginx-ingress namespace
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    console.log("Rendered inside the client");
    // Makes call from within the browser
    return axios.create({
      baseURL: "",
    });
  }
};
