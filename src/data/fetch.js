const sleep = async (seconds) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1_000 * seconds);
  });

export default async (...args) => {
  if (typeof args[0] === "string") {
    console.log(`fetching ${args[0]}`);
  } else if (typeof args[0] === "object") {
    console.log(`fetching ${args[0].url}`);
  }

  const retry = (duration) => async (response) => {
    if (response.status < 300) {
      return response;
    }

    console.log(
      `  > got status ${response.status}; waiting ${duration} seconds to retry`,
    );
    await sleep(duration);
    return fetch(...args);
  };

  return fetch(...args)
    .then(retry(10))
    .then(retry(30))
    .then(retry(60));
};
