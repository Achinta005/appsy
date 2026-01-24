import useApi from "./authservices";

// Helper function to use apiFetch hook
const usePortfolioApi = () => {
  const apiFetch = useApi();

  return {
    // Admin
    Ai_enhance: async (plainText) => {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/ai-enhance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: plainText }),
        }
      );
      return response.json();
    },

    Upload_blog: async (formData) => {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/upload_blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      return response.json();
    },

    // Post Notepad Documents
    Notepad: async (title, content, user) => {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/create_documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, title, content }),
        }
      );
      return response.json();
    },

    // Fetch User Notepad Documents
    FetchNotepadDocs: async (user) => {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/fetch_documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      return response.json();
    },
  };
};

export default usePortfolioApi;