import { apiCall } from "./baseApi";

export const PortfolioApiService = {
  // Admin
  Ai_enhance: async (plainText) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/ai-enhance`,
      {
        method: "POST",
        body: JSON.stringify({ text: plainText }),
      }
    );
  },

  Upload_blog: async (formData) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/upload_blog`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
  },

  Fetch_IP: async (userId) => {
    return apiCall(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/get-ip`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },

  ViewIp: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/view-ip`);
  },

  deleteIpAddress: async (ipId) => {
    return apiCall(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/delete-ip/${ipId}`, {
      method: "DELETE",
    });
  },

  // Authentication
  Register: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  // AnimeList
  FetchAnimeList: async (username) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/alist/anilist/BaseFunction/fetch`,
      {
        method: "POST",
        body: JSON.stringify({ username: username.trim() }),
      }
    );
  },

  UplaodProject: async (formData) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/project_upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  //View Contact Responses
  ContactResponses: async () => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/contact_responses`
    );
  },

  deleteContact: async (contactId) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/delete_response/${contactId}`,
      {
        method: "DELETE",
      }
    );
  },

  //Post Notepad Documents
  Notepad: async (title, content, user) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/create_documents`,
      {
        method: "POST",
        body: JSON.stringify({ user, title, content }),
      }
    );
  },

  //Fetch User Notepad Documents
  FetchNotepadDocs: async (user) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/fetch_documents`,
      {
        method: "POST",
        body: JSON.stringify(user),
      }
    );
  },
};
