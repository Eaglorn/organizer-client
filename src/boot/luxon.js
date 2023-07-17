import { boot } from "quasar/wrappers";
import { DateTime } from "luxon";

export default boot(({ app }) => {
  app.config.globalProperties.$datetime = DateTime;
});

export { DateTime };
