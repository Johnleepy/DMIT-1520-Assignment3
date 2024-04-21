async function postRequest(data) {
  try {
    const res = await fetch(
      "https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/favorites",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error saving favorite albums:", error);
  }
}

async function getRequest(url) {
  const res = await fetch(url);
  return await res.json();
}

async function deleteRequest(id) {
  try {
    await fetch(
      `https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/favorites/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting favorite albums:", error);
  }
}

export { postRequest, getRequest, deleteRequest };
