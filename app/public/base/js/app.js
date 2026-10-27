import { Router } from "./router.js";
import { routes } from "../../main/routes.js";

const router = new Router({
  routes,
  outlet: document.querySelector("#main"),
  appName: "メモ帳",
});

router.start();
