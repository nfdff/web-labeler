export default (url: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((content) => {
        resolve(content);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
