import { syncQuestionBank } from "../src/lib/sync-question-bank";

syncQuestionBank()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== "success") process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
